import { useState } from 'react';

export const useBoolean = (initializeValue = false) => {
  const [value, setValue] = useState(!!initializeValue);

  const toggle = () => {
    setValue((prevValue) => !prevValue);
  };

  const setFalse = () => {
    setValue(false);
  };

  const setTrue = () => {
    setValue(true);
  };

  return {
    value,
    toggle,
    setFalse,
    setTrue,
    setValue,
  };
};
