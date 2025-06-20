import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { ListUser } from '@/types';

export default function AvatarPicture({ user }: { user: ListUser & { is_friend: number } }) {
  const getInitials = useInitials();

  return (
    <Avatar className={cn(['h-12 w-12 overflow-hidden rounded-full border-3', user.is_friend ? 'border-secondary' : 'border-primary'])}>
      <AvatarImage
        src={user.avatar ?? undefined}
        alt={user.name}
      />
      <AvatarFallback className="text-primary rounded-lg bg-white">
        <span className="text-xs">{getInitials(user.name)}</span>
      </AvatarFallback>
    </Avatar>
  );
}
