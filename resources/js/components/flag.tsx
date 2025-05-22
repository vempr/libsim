type FlagProps = {
  name: string;
  code: string;
};

export function Flag({ name, code }: FlagProps) {
  return (
    <img
      alt={name}
      src={`/flags/${code}.svg`}
      className="w-6 rounded-xs"
    />
  );
}
