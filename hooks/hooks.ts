import { useCallback } from 'react';
import { useRouter } from 'next/router';

export function useRouterRefresh() {
  const { asPath, replace } = useRouter();

  return useCallback(() => replace(asPath), [asPath, replace]);
}
