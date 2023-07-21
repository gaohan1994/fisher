import { useCallback, useMemo, useState } from 'react';

/**
 * useSet hook
 * @param initializeValue
 * @returns
 */
export const useSet = <T = any>(initializeValue = new Set<T>()) => {
  const [value, setValue] = useState<Set<T>>(new Set(initializeValue));

  const actions = useMemo(() => {
    const add = (item: T) => {
      setValue((prevSet) => new Set([...Array.from(prevSet), item]));
    };

    const remove = (item: T) => {
      setValue((prevSet) => new Set(Array.from(prevSet).filter((i) => i !== item)));
    };

    const reset = () => {
      setValue(initializeValue);
    };

    return { add, remove, reset };
  }, [setValue]);

  const has = useCallback((item: T) => value.has(item), [value]);

  return [value, { ...actions, has }] as const;
};
