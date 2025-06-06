import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInitials } from '@/hooks/use-initials';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';

import { Button } from './ui/button';
import { Slider } from './ui/slider';

const MAX_FILE_SIZE = 16777216;

function fileSizeValidator(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: 'file-too-large',
      message: `File size is larger than 16MB`,
    };
  }

  return null;
}

export default function AvatarProfile() {
  const { auth } = usePage<SharedData>().props;
  const { put, delete: destroy } = useForm();
  const getInitials = useInitials();

  const editor = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File>();
  const [scale, setScale] = useState<number>(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator: fileSizeValidator,
    maxFiles: 1,
    accept: {
      'image/avif': [],
      'image/jpeg': [],
      'image/png': [],
      'image/svg': [],
      'image/webp': [],
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center hover:cursor-pointer hover:opacity-85 active:opacity-75">
          <Avatar className="flex h-30 w-30 items-center overflow-hidden rounded-full">
            <AvatarImage
              src={auth.user.avatar}
              alt={auth.user.name}
            />
            <AvatarFallback className="rounded-lg bg-white text-red-600/80">
              <span className="text-5xl select-none">{getInitials(auth.user.name)}</span>
            </AvatarFallback>
          </Avatar>
          <p className="bg-sidebar w-min -translate-y-8 rounded-lg px-2.5 py-0.5 text-xs opacity-45">Edit</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit your avatar</DialogTitle>
        <DialogDescription>You can preview and crop your image before upload. Please select a file to view the file preview.</DialogDescription>

        {/** preview + crop here */}
        {image && (
          <div className="flex flex-col items-center justify-center gap-y-4">
            <AvatarEditor
              ref={editor}
              image={image}
              width={150}
              height={150}
              border={6}
              color={[255, 255, 255, 0.7]} // RGBA
              scale={scale}
              borderRadius={125}
              className="rounded-full"
            />
            <Slider
              defaultValue={[0]}
              onValueChange={(s) => setScale(1 + s[0] / 25)}
              max={100}
              step={1}
            />
          </div>
        )}

        <div
          {...getRootProps()}
          className="flex h-40 w-full flex-col items-center justify-center border-4 border-dashed"
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop your file here, or click to select files</p>}
          <em className="text-muted-foreground text-xs">Accepted formats: AVIF, JPEG, PNG, SVG, WEBP. Max file size: 16MB.</em>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              className="hover:cursor-pointer"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            asChild
            variant="destructive"
          >
            <button
              className="hover:cursor-pointer"
              type="button"
              onClick={() => destroy(route('profile.avatar.update'))}
            >
              Delete current avatar
            </button>
          </Button>

          <Button asChild>
            <button
              className="hover:cursor-pointer"
              type="button"
              onClick={() => {
                if (editor.current) {
                  const canvasScaled = editor.current.getImageScaledToCanvas().toDataURL();
                  put(
                    route('profile.avatar.update', {
                      file: canvasScaled,
                    }),
                  );
                }
              }}
            >
              Update avatar
            </button>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
