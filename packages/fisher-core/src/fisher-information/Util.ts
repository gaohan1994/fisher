import { InformationMessage } from './Message.js';

function throttled(fn: any, delay = 500) {
  let timer: any;
  let starttime = Date.now();
  let cachedInformations: InformationMessage[] = [];

  const execute = () => {
    fn.call(null, cachedInformations);
    cachedInformations = [];
    starttime = Date.now();
  };

  return function (currentInformations: InformationMessage[]) {
    let curTime = Date.now(); // 当前时间
    let remaining = delay - (curTime - starttime); // 从上一次到现在，还剩下多少多余时间

    cachedInformations = cachedInformations.concat(currentInformations);
    clearTimeout(timer);

    if (remaining <= 0) {
      execute();
    } else {
      timer = setTimeout(execute, remaining);
    }
  };
}

function debounce(fn: any, delay = 500) {
  let timer: any;
  let cachedInformations: InformationMessage[] = [];

  const execute = () => {
    fn.call(null, cachedInformations);
    cachedInformations = [];
  };

  return function (currentInformations: InformationMessage[]) {
    cachedInformations = cachedInformations.concat(currentInformations);
    clearTimeout(timer);
    timer = setTimeout(execute, delay);
  };
}

export { throttled, debounce };
