import { useCallback, useState } from 'react';

const FRIENDS_ONLY_KEY = 'friendsOnly';

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export function useFriendsOnly() {
  const [friendsOnly, setFriendsOnly] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem(FRIENDS_ONLY_KEY);
    return stored === 'true';
  });

  const updateFriendsOnly = useCallback((value: boolean) => {
    setFriendsOnly(value);
    localStorage.setItem(FRIENDS_ONLY_KEY, value.toString());
    setCookie(FRIENDS_ONLY_KEY, value.toString());
  }, []);

  return { friendsOnly, updateFriendsOnly } as const;
}
