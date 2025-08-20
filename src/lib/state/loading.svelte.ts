class Loading {
  private value = $state(false);

  get isLoading(): boolean {
    return this.value;
  }

  startLoading(): void {
    this.value = true;
  }

  stopLoading(): void {
    this.value = false;
  }

  async withLoading(func: () => void | Promise<void>): Promise<void> {
    this.startLoading();
    try {
      await func();
    } finally {
      this.stopLoading();
    }
  }
}

export const loading = new Loading();
