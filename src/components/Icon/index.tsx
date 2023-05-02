interface IIconProps extends React.HTMLProps<HTMLSpanElement> {
  name: string;
}

export const Icon = ({ name, ...rest }:IIconProps) => {
  return (
    <span className="material-symbols-outlined" {...rest}>
      {name}
    </span>
  );
};
