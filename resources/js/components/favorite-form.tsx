import useDebounce from '@/hooks/use-debounce';
import { useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    if (favoriteDebounced === true) post(route('favorite.store', workId));
    if (favoriteDebounced === false) destroy(route('favorite.destroy', workId));
  }, [favoriteDebounced, post, destroy, workId]);

  return (
    <button
      onClick={() => setFavorite(!favorite)}
      className="bg-secondary hover:bg-secondary/90 w-min rounded-md p-1 shadow-xs hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50"
      disabled={processing}
    >
      <Star
        className={`absolute transition-opacity ${favorite ? 'opacity-100' : 'opacity-0'}`}
        fill="#ffff00"
        stroke="#ffff00"
        size={35}
        strokeWidth={1}
      />
      <Star
        className={`transition-opacity ${favorite ? 'opacity-0' : 'opacity-100'}`}
        stroke="#ffffff"
        size={35}
        strokeWidth={1}
        strokeOpacity={favorite ? 0.9 : 0.6}
      />
    </button>
  );
}
