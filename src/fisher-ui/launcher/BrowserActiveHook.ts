/*
 * This react hook tracks page visibility using browser page visibility api.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 *
 * Use: const pageVisibilityStatus = usePageVisibility();
 * Return type: boolean
 */

import React from 'react';

let hidden: string, visibilityChange: string;

if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof (document as any).msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

export default function usePageVisibility() {
  const [visibilityStatus, setVisibilityStatus] = React.useState((document as any)[hidden]);

  React.useEffect(() => {
    function handleVisibilityChange() {
      setVisibilityStatus((document as any)[hidden]);
    }

    document.addEventListener(visibilityChange, handleVisibilityChange);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);

  return visibilityStatus;
}
