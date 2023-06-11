/*
 * This react hook tracks page visibility using browser page visibility api.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 *
 * Use: const pageVisibilityStatus = usePageVisibility();
 * Return type: boolean
 */

import React from 'react';

let status: string = 'visibilityState',
  visibilityChange: string;

if (typeof document.hidden !== 'undefined') {
  visibilityChange = 'visibilitychange';
} else if (typeof (document as any).msHidden !== 'undefined') {
  visibilityChange = 'msvisibilitychange';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
  visibilityChange = 'webkitvisibilitychange';
}

export default function useBrowserHidden() {
  const [visibilityStatus, setVisibilityStatus] = React.useState((document as any)[status] !== 'visible');

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibilityStatus((document as any)[status] !== 'visible');
    };
    document.addEventListener(visibilityChange, handleVisibilityChange);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);

  return visibilityStatus;
}
