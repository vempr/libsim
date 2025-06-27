import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export function useResponsiveDialog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return {
      rd: {
        Wrapper: Drawer,
        Close: DrawerClose,
        Content: DrawerContent,
        Description: DrawerDescription,
        Footer: DrawerFooter,
        Header: DrawerHeader,
        Title: DrawerTitle,
        Trigger: DrawerTrigger,
      },
      open,
      setOpen,
    };
  }

  return {
    rd: {
      Wrapper: Sheet,
      Close: SheetClose,
      Content: SheetContent,
      Description: SheetDescription,
      Footer: SheetFooter,
      Header: SheetHeader,
      Title: SheetTitle,
      Trigger: SheetTrigger,
    },
    open,
    setOpen,
  };
}
