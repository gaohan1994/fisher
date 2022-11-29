import { useEffect, useState, FC } from 'react';
import { FisherTimer } from '@FisherCore';

const FisherTimerDemo: FC = () => {
  const [sum, setSum] = useState(0);
  const [timer] = useState(
    new FisherTimer({ action: () => setSum((prevSum) => ++prevSum) })
  );

  useEffect(() => {
    return () => {
      timer.stopTimer();
    };
  }, []);

  return (
    <div>
      FisherTimerDemo
      <h3>{sum}</h3>
      <button onClick={() => timer.startTimer(1000)}>startTimer</button>
      <button onClick={() => timer.stopTimer()}>stopTimer</button>
    </div>
  );
};

export const FisherCoreDemo: FC = () => {
  return (
    <div>
      <FisherTimerDemo />
    </div>
  );
};
