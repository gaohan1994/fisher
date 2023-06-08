import FakeTimer from '@sinonjs/fake-timers';

class FakeClock {
  public static instance: FakeClock;

  public static create(): FakeClock {
    if (!FakeClock.instance) {
      FakeClock.instance = new FakeClock();
    }
    return FakeClock.instance;
  }

  public clock = FakeTimer.createClock();
}

const fakeClock = new FakeClock();

export { fakeClock };
