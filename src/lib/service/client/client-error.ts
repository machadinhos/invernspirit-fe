import { browser } from '$app/environment';
import { clientErrorToastSnippet } from '$snippets';
import { toasts } from '$state';

export class ClientError extends Error {
  statusCode: number;
  issues: string[];

  constructor(message: string, statusCode: number, issues: string[] = []) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
    this.issues = issues;
  }

  pushIssuesToToasts(): void {
    if (browser) {
      if (this.statusCode === 500) {
        toasts.push(clientErrorToastSnippet, {
          extraParams: 'Something went wrong. Hang tight while we fix it!',
          type: 'error',
          duration: 8000,
        });
        return;
      }
      for (const issue of this.issues) {
        toasts.push(clientErrorToastSnippet, { extraParams: issue, type: 'error', duration: 8000 });
      }
    }
  }
}
