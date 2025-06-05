import { getAccessToken, setAccessToken } from './access-token';
import { browser } from '$app/environment';
import { ClientError } from '$service';
import { ClientErrorToastComponent } from '$components-toasts';
import { toasts } from '$state';

export type RetriesConfig = {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (response: Response) => Promise<boolean> | boolean;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestHostContext = {
  host: string;
  headers?: Record<string, string>;
};

type RequestBaseContext = {
  endpoint: `/${string}`;
  method: HttpMethod;
} & RequestHostContext;

type RequestContext<Body = void> = {
  searchParams?: Record<string, string>;
  body?: Body;
  retriesConfig?: RetriesConfig;
} & RequestBaseContext;

export class Client<ResponseBody, PayloadBody = void> {
  protected readonly context: RequestContext<PayloadBody>;

  protected constructor(context: RequestBaseContext) {
    this.context = context;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static create<ResponseBody, PayloadBody = void>() {
    return {
      withHostContext: Client.withHostContext<ResponseBody, PayloadBody>,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static withHostContext<ResponseBody, PayloadBody>(context: RequestHostContext) {
    return {
      withEndpoint: Client.prepareWithEndpoint<ResponseBody, PayloadBody>(context),
    };
  }

  private static prepareWithEndpoint<ResponseBody, PayloadBody>(context: RequestHostContext) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (endpoint: RequestBaseContext['endpoint']) => {
      return {
        withMethod: Client.prepareWithMethod<ResponseBody, PayloadBody>(context, endpoint),
      };
    };
  }

  private static prepareWithMethod<ResponseBody, PayloadBody>(
    context: RequestHostContext,
    endpoint: RequestBaseContext['endpoint'],
  ) {
    return <Method extends RequestBaseContext['method']>(
      method: Method,
    ): Method extends 'GET' ? Client<ResponseBody, PayloadBody> : ClientWithBody<ResponseBody, PayloadBody> => {
      if (method === 'GET') {
        return new Client<ResponseBody, PayloadBody>({ ...context, endpoint, method }) as Method extends 'GET'
          ? Client<ResponseBody, PayloadBody>
          : ClientWithBody<ResponseBody, PayloadBody>;
      }
      return new ClientWithBody<ResponseBody, PayloadBody>({ ...context, endpoint, method });
    };
  }

  private get url(): string {
    const { host, endpoint, searchParams } = this.context;
    let url = `${host}${endpoint}`;

    if (searchParams) {
      url += `?${new URLSearchParams(searchParams)}`;
    }

    return url;
  }

  private get headers(): Record<string, string> {
    const accessToken = getAccessToken();
    return {
      ...this.context.headers,
      ...(accessToken && { authorization: `Bearer ${accessToken}` }),
    };
  }

  withHeaders(headers: RequestContext['headers']): this {
    this.context.headers = { ...this.context.headers, ...headers };
    return this;
  }

  withSearchParams(searchParams: RequestContext['searchParams']): this {
    this.context.searchParams = searchParams;
    return this;
  }

  withRetries(retryConfig: RequestContext['retriesConfig']): this {
    this.context.retriesConfig = retryConfig;
    return this;
  }

  private doFetch(): Promise<Response> {
    return fetch(this.url, {
      headers: this.headers,
      method: this.context.method,
      ...(this.context.body && { body: JSON.stringify(this.context.body) }),
    });
  }

  async call(shouldPushIssuesToToasts = true): Promise<ResponseBody> {
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
      if (browser) toasts.push(ClientErrorToastComponent, { extraParams: { error: errorString }, type: 'error' });
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
  }
}

class ClientWithBody<ResponseBody, PayloadBody> extends Client<ResponseBody, PayloadBody> {
  withBody(body: PayloadBody): this {
    this.context.body = body;
    return this;
  }
}

const pushIssuesToToasts = (issues: string[]): void => {
  if (browser) {
    for (const issue of issues) {
      toasts.push(ClientErrorToastComponent, { extraParams: { error: issue }, type: 'error', duration: 8000 });
    }
  }
};
