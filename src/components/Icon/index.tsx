export const Icon = ({
  name,
  style,
}: {
  name: string;
  style?: React.CSSProperties
}) => {
  return (
    <span className="material-symbols-outlined" style={style}>
      {name}
    </span>
  );
};
