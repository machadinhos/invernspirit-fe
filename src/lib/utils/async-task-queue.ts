export class AsyncTaskQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;

  enqueue = <T, Args extends unknown[] = []>(asyncFunc: (...args: Args) => Promise<T>, ...args: Args): Promise<T> => {
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
  };

  private triggerQueueProcessing = async (): Promise<void> => {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) await task();
      }
    } finally {
      this.isProcessing = false;
    }
  };
}
