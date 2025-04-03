import { getAccessToken, setAccessToken } from './access-token';
import { browser } from '$app/environment';
import { ClientError } from '$service';
import { clientErrorToastSnippet } from '$snippets';
import { toasts } from '$state';

export type RetriesConfig = {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (response: Response) => Promise<boolean> | boolean;
};

export type RequestHostContext = {
  host: string;
  headers?: Record<string, string>;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestBaseContext = {
  endpoint: string;
  method: HttpMethod;
} & RequestHostContext;

type RequestContext<T = void> = {
  queryParams?: Record<string, string>;
  body?: T;
  retriesConfig?: RetriesConfig;
} & RequestBaseContext;

export class Client<T, K = void> {
  protected readonly context: RequestContext<K>;
  private _url: string | null = null;
  private _headers: Record<string, string> | null = null;

  protected constructor(context: RequestBaseContext) {
    this.context = context;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static create = <T, K = void>() => {
    return {
      withHostContext: Client.withHostContext<T, K>,
    };
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static withHostContext = <T, K = void>(context: RequestHostContext) => {
    return {
      withEndpoint: Client.prepareWithEndpoint<T, K>(context),
    };
  };

  private static prepareWithEndpoint = <T, K = void>(context: RequestHostContext) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (endpoint: RequestBaseContext['endpoint']) => {
      return {
        withMethod: Client.prepareWithMethod<T, K>(context, endpoint),
      };
    };
  };

  private static prepareWithMethod = <T, K = void>(
    context: RequestHostContext,
    endpoint: RequestBaseContext['endpoint'],
  ) => {
    return <Method extends RequestBaseContext['method']>(
      method: Method,
    ): Method extends 'GET' ? Client<T, K> : ClientWithBody<T, K> => {
      if (method === 'GET') {
        return new Client<T, K>({ ...context, endpoint, method }) as Method extends 'GET'
          ? Client<T, K>
          : ClientWithBody<T, K>;
      }
      return new ClientWithBody<T, K>({ ...context, endpoint, method });
    };
  };

  private get url(): string {
    if (this._url === null) {
      const { host, endpoint, queryParams } = this.context;
      const query = queryParams
        ? `?${Object.entries(queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')}`
        : '';
      this._url = `${host}${endpoint}${query}`;
    }

    return this._url;
  }

  private get headers(): Record<string, string> {
    if (this._headers === null) {
      const accessToken = getAccessToken();
      this._headers = {
        ...this.context.headers,
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
        ...(this.context.body && { 'Content-Type': 'application/json' }),
      };
    }

    return this._headers;
  }

  withHeaders = (headers: RequestContext['headers']): this => {
    this.context.headers = { ...this.context.headers, ...headers };
    return this;
  };

  withQueryParams = (queryParams: RequestContext['queryParams']): this => {
    this.context.queryParams = queryParams;
    return this;
  };

  withRetries = (retryConfig: RequestContext['retriesConfig']): this => {
    this.context.retriesConfig = retryConfig;
    return this;
  };

  private doFetch = (): Promise<Response> => {
    return fetch(this.url, {
      headers: this.headers,
      method: this.context.method,
      ...(this.context.body && { body: JSON.stringify(this.context.body) }),
    });
  };

  call = async (shouldPushIssuesToToasts = true): Promise<T> => {
    let response: Response;

    try {
      response = await this.doFetch();

      if (this.context.retriesConfig) {
        const { maxRetries, retryDelay, shouldRetry } = this.context.retriesConfig;
        let retries = 0;
        while (retries < maxRetries && (await shouldRetry(response.clone()))) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retries += 1;
          response = await this.doFetch();
        }
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);

      const errorString = 'Unable to connect to server';
      if (browser) toasts.push(clientErrorToastSnippet, { extraParams: errorString, type: 'error' });
      throw new Error(`${errorString} ${this.context.method} ${this.url}`);
    }

    if (response.ok) {
      const { data, issues } = await response.json();
      if (browser && data.accessToken) setAccessToken(data.accessToken);
      if (issues && shouldPushIssuesToToasts) pushIssuesToToasts(issues);

      return data;
    }

    if (response.headers.get('content-type') === 'application/json') {
      const responseBody = await response.json();
      const { issues } = responseBody;
      if (shouldPushIssuesToToasts) {
        if (issues) {
          pushIssuesToToasts(response.status !== 500 ? issues : ['Something went wrong. Hang tight while we fix it!']);
        } else {
          pushIssuesToToasts(
            response.status === 429
              ? ['Careful with that button, Eugene.']
              : ['Something went wrong. Hang tight while we fix it!'],
          );
        }
      }
      throw new ClientError(
        `Error code: ${response.status}\nError calling endpoint ${this.context.method} ${this.url}\nClient error: ${JSON.stringify(responseBody, null, 2)}`,
        response.status,
        issues,
      );
    }

    if (shouldPushIssuesToToasts) {
      pushIssuesToToasts(
        response.status === 429
          ? ['Careful with that button, Eugene.']
          : ['Something went wrong. Hang tight while we fix it!'],
      );
    }
    throw new ClientError(
      `Error code: ${response.status}\nError calling endpoint ${this.context.method} ${this.url}\nClient error: ${await response.text()}`,
      response.status,
    );
  };
}

class ClientWithBody<T, K> extends Client<T, K> {
  withBody = (body: K): this => {
    this.context.body = body;
    return this;
  };
}

const pushIssuesToToasts = (issues: string[]): void => {
  if (browser) {
    for (const issue of issues) {
      toasts.push(clientErrorToastSnippet, { extraParams: issue, type: 'error', duration: 8000 });
    }
  }
};
