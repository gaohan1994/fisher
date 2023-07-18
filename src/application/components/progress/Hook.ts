import { useEffect, useRef, useState } from 'react';
import { Timer } from '@FisherCore';

export const useTimerProgress = (timer: Timer) => {
  const animateRef = useRef(-1);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const isActive = timer.active;

    const animateProgressFrame = () => {
      setValue(timer.progress);
      animateRef.current = requestAnimationFrame(animateProgressFrame);
    };

    if (isActive) {
      animateRef.current = requestAnimationFrame(animateProgressFrame);
    } else {
      cancelAnimationFrame(animateRef.current);
    }

    return () => {
      cancelAnimationFrame(animateRef.current);
      animateRef.current = -1;
    };
  }, [timer.active]);

  return value;
};
