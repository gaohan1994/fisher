import { GameMode } from './GameMode';

interface Archive {
  archiveId: string;
  gameMode: GameMode;
  displayName: string;
  content: any;
}

/**
 * 创建一个本地的存档
 *
 * @export
 * @param {GameMode} gameMode
 * @param {string} displayName
 * @return {*}  {Archive}
 */
export function createArchive(
  gameMode: GameMode,
  displayName: string
): Archive {
  const archive: Archive = {
    archiveId: displayName + new Date().getTime().toString(),
    gameMode,
    displayName,
    content: {},
  };
  return archive;
}

/**
 * useArchive hook
 * Archive 模块
 *
 * @export
 * @return {*}
 */
export function useArchive() {
  return {};
}
