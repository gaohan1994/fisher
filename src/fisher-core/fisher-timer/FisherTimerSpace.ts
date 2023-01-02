type Timer = ReturnType<typeof setTimeout>;

export class FisherTimerSpace {
  static space(delay: number) {
    return new FisherTimerSpace().space(delay);
  }

  public timer: Timer | undefined = undefined;

  public space = (delay: number) => {
    return new Promise((resolve) => {
      this.clear();
      this.timer = setTimeout(resolve, delay);
    });
  };

  public clear = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };
}
