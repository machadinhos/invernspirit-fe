import { getAccessToken, setAccessToken } from './access-token';
import { browser } from '$app/environment';
import { ClientError } from '$service';
import { ClientErrorToast } from '$components-toasts';
import type { Jsonable } from '$types';
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

type RequiredBuilderMethods = 'withHostContext' | 'withEndpoint' | 'withMethod';
type OptionalBuilderMethods = 'withHeaders' | 'withSearchParams' | 'withRetries' | 'withBody';
type BuilderMethods = RequiredBuilderMethods | OptionalBuilderMethods;

type ClientBuilderBase<ResponseBody, PayloadBody> = Omit<Client<ResponseBody, PayloadBody>, BuilderMethods | 'call'>;

type FluentStep<NextStep extends RequiredBuilderMethods | 'withBody', ResponseBody, PayloadBody> = {
  _context: Client<ResponseBody, PayloadBody>['_context'];
} & Pick<Client<ResponseBody, PayloadBody>, NextStep>;

type OptionalStepResult<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ClientBuilderType extends ClientBuilderBase<any, any>,
  NewIgnore extends BuilderMethods,
> = Omit<ClientBuilderType, NewIgnore>;

export class Client<ResponseBody, PayloadBody = void> {
  readonly _context: RequestContext<PayloadBody> = {} as RequestContext<PayloadBody>;

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private constructor() {}

  static create<ResponseBody extends Jsonable | never, PayloadBody extends Jsonable | never = never>(): FluentStep<
    'withHostContext',
    ResponseBody,
    PayloadBody
  > {
    return new Client<ResponseBody, PayloadBody>();
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  withHostContext<This extends ClientBuilderBase<any, any>>(
    this: This,
    { host, headers }: RequestHostContext,
  ): FluentStep<'withEndpoint', ResponseBody, PayloadBody> {
    this._context.host = host;
    this._context.headers = headers;
    return this as any;
  }

  withEndpoint<This extends ClientBuilderBase<any, any>>(
    this: This,
    endpoint: RequestBaseContext['endpoint'],
  ): FluentStep<'withMethod', ResponseBody, PayloadBody> {
    this._context.endpoint = endpoint;
    return this as any;
  }

  withMethod<This extends ClientBuilderBase<any, any>, Method extends RequestBaseContext['method']>(
    this: This,
    method: Method,
  ): Method extends 'GET'
    ? [PayloadBody] extends [never]
      ? OptionalStepResult<Client<ResponseBody, PayloadBody>, RequiredBuilderMethods | 'withBody'>
      : never
    : [PayloadBody] extends [never]
      ? OptionalStepResult<Client<ResponseBody, PayloadBody>, RequiredBuilderMethods | 'withBody'>
      : FluentStep<'withBody', ResponseBody, PayloadBody> {
    this._context.method = method;
    return this as any;
  }

  withBody<This extends ClientBuilderBase<any, any>>(
    this: This,
    body: PayloadBody,
  ): OptionalStepResult<Client<ResponseBody, PayloadBody>, RequiredBuilderMethods | 'withBody'> {
    this._context.body = body;
    return this as any;
  }

  withHeaders<This extends ClientBuilderBase<any, any>>(
    this: This,
    headers: RequestContext['headers'],
  ): OptionalStepResult<This, 'withHeaders'> {
    this._context.headers = { ...this._context.headers, ...headers };
    return this as any;
  }

  withSearchParams<This extends ClientBuilderBase<any, any>>(
    this: This,
    searchParams: RequestContext['searchParams'],
  ): OptionalStepResult<This, 'withSearchParams'> {
    this._context.searchParams = searchParams;
    return this as any;
  }

  withRetries<This extends ClientBuilderBase<any, any>>(
    this: This,
    retryConfig: RequestContext['retriesConfig'],
  ): OptionalStepResult<This, 'withRetries'> {
    this._context.retriesConfig = retryConfig;
    return this as any;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private get url(): string {
    const { host, endpoint, searchParams } = this._context;
    let url = `${host}${endpoint}`;

    if (searchParams) {
      url += `?${new URLSearchParams(searchParams)}`;
    }

    return url;
  }

  private get headers(): Record<string, string> {
    const accessToken = getAccessToken();
    return {
      ...this._context.headers,
      ...(accessToken && { authorization: `Bearer ${accessToken}` }),
    };
  }

  private doFetch(): Promise<Response> {
    return fetch(this.url, {
      headers: this.headers,
      method: this._context.method,
      ...(this._context.body && { body: JSON.stringify(this._context.body) }),
    });
  }

  async call(shouldPushIssuesToToasts = true): Promise<ResponseBody> {
    let response: Response;

    try {
      response = await this.doFetch();

      if (this._context.retriesConfig) {
        const { maxRetries, retryDelay, shouldRetry } = this._context.retriesConfig;
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
      if (browser) toasts.push(ClientErrorToast, { extraParams: { error: errorString }, type: 'error' });
      throw new Error(`${errorString} ${this._context.method} ${this.url}`);
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
              ? ['Woah, you’re sending requests quickly. Try again in 15 seconds.']
              : ['Something went wrong. Hang tight while we fix it!'],
          );
        }
      }
      throw new ClientError(
        `Error code: ${response.status}\nError calling endpoint ${this._context.method} ${this.url}\nClient error: ${JSON.stringify(responseBody, null, 2)}`,
        response.status,
        issues,
      );
    }

    if (shouldPushIssuesToToasts) {
      pushIssuesToToasts(
        response.status === 429
          ? ['Woah, you’re sending requests quickly. Try again in 15 seconds.']
          : ['Something went wrong. Hang tight while we fix it!'],
      );
    }
    throw new ClientError(
      `Error code: ${response.status}\nError calling endpoint ${this._context.method} ${this.url}\nClient error: ${await response.text()}`,
      response.status,
    );
  }
}

const pushIssuesToToasts = (issues: string[]): void => {
  if (browser) {
    issues.forEach((issue) => {
      toasts.push(ClientErrorToast, { extraParams: { error: issue }, type: 'error', duration: 8000 });
    });
  }
};
