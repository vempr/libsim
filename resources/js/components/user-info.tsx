import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        <AvatarImage
          src={user.avatar}
          alt={user.name}
        />
        <AvatarFallback className="rounded-lg bg-white text-red-600/80">
          <span className="text-xs">{getInitials(user.name)}</span>
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email as string}</span>}
      </div>
    </>
  );
}
