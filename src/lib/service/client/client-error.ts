import { browser } from '$app/environment';
import { ClientErrorToast } from '$components-toasts';
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
        toasts.push(ClientErrorToast, {
          extraParams: { error: 'Something went wrong. Hang tight while we fix it!' },
          type: 'error',
          duration: 8000,
        });
        return;
      }
      this.issues.forEach((issue) => {
        toasts.push(ClientErrorToast, { extraParams: { error: issue }, type: 'error', duration: 8000 });
      });
    }
  }
}
