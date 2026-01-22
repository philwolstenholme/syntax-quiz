import { useCallback } from 'react';

export const useViewTransition = () => {
  const withTransition = useCallback((updateFn) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        updateFn();
      });
    } else {
      updateFn();
    }
  }, []);

  return withTransition;
};
