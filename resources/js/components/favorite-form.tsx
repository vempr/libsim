import useDebounce from '@/hooks/use-debounce';
import { useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from './ui/button';

interface FavoriteFormProps {
  favorited: boolean;
  workId: string;
}

export function FavoriteForm({ favorited, workId }: FavoriteFormProps) {
  const { post, delete: destroy, processing } = useForm();
  const [favorite, setFavorite] = useState(favorited);
  const favoriteDebounced = useDebounce(favorite, 300);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (favoriteDebounced === true) post(route('favorite.store', workId), { preserveScroll: true });
    if (favoriteDebounced === false) destroy(route('favorite.destroy', workId), { preserveScroll: true });
  }, [favoriteDebounced, post, destroy, workId]);

  return (
    <Button
      onClick={() => setFavorite(!favorite)}
      variant="outline"
      disabled={processing}
      className="w-max"
      aria-pressed={favorite}
    >
      <span className="sr-only">{favorite ? 'Unfavorite this work' : 'Favorite this work'}</span>

      {favorite ? (
        <Star
          fill="oklch(0.4815 0.1178 263.3758)"
          stroke="oklch(0.4815 0.1178 263.3758)"
          strokeWidth={1}
        />
      ) : (
        <Star
          stroke="#ffffff"
          strokeWidth={1}
        />
      )}
    </Button>
  );
}
