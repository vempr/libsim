import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

interface AvatarPictureProps {
  avatar: string | null;
  name: string;
  is_friend: number;
  className?: string;
}

export default function AvatarPicture({ avatar, name, is_friend, className }: AvatarPictureProps) {
  const getInitials = useInitials();

  return (
    <Avatar className={cn(['h-12 w-12 overflow-hidden rounded-full border-3', is_friend ? 'border-secondary' : 'border-primary', className])}>
      <AvatarImage
        src={avatar ?? undefined}
        alt={name}
      />
      <AvatarFallback className="text-primary rounded-lg bg-white">
        <span className="text-xs">{getInitials(name)}</span>
      </AvatarFallback>
    </Avatar>
  );
}
