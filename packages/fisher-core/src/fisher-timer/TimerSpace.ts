type Timer = ReturnType<typeof setTimeout>;

export class TimerSpace {
  static space(delay: number) {
    return new TimerSpace().space(delay);
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
