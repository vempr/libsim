import { useCallback, useState } from 'react';

type LocalStorageKey = 'friendsOnly' | 'searchIncludeFavorites';

export function useLocalStorage(key: LocalStorageKey) {
  const [ls, setLs] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem(key);
    return stored === 'true';
  });

  const updateLs = useCallback((value: boolean) => {
    setLs(value);
    localStorage.setItem(key, value.toString());
  }, []);

  return { ls, updateLs } as const;
}
