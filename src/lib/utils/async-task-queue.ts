export class AsyncTaskQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;
  idle = Promise.resolve();

  enqueue<Result, Args extends unknown[] = []>(
    asyncFunc: (...args: Args) => Promise<Result>,
    ...args: Args
  ): Promise<Result> {
    return new Promise((resolve, reject) => {
      const task = async (): Promise<void> => {
        try {
          resolve(await asyncFunc(...args));
        } catch (error) {
          reject(error);
        }
      };

      this.queue.push(task);
      this.triggerQueueProcessing();
    });
  }

  private async triggerQueueProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    let resolve: (() => void) | undefined;
    this.idle = new Promise((res) => (resolve = res));

    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) await task();
      }
    } finally {
      this.isProcessing = false;
      resolve?.();
    }
  }
}
