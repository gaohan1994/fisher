import { useState } from 'react';

const useArray = <T>(initialValue = [] as Array<T>) => {
  const [value, setValue] = useState(initialValue);

  const push = (element: T) => {
    setValue((oldValue) => [...oldValue, element]);
  };

  const remove = (index: number) => {
    setValue((oldValue) => oldValue.filter((_, i) => i !== index));
  };

  const clear = () => {
    setValue([]);
  };

  const isEmpty = () => value.length === 0;

  return { value, setValue, push, remove, clear, isEmpty };
};

export { useArray };
