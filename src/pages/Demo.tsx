import { useEffect } from 'react';
import { createArchive, GameMode } from '../fisher-core';

export const Demo = () => {
  useEffect(() => {
    const archive = createArchive(GameMode.NORMAL, 'harper.gao');
    console.log('archive', archive);
  }, []);
  return <div>demo</div>;
};
