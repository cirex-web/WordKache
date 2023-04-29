interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  name: string;
}

export const Icon = ({ name, ...rest }:IconProps) => {
  return (
    <span className="material-symbols-outlined" {...rest}>
      {name}
    </span>
  );
};
