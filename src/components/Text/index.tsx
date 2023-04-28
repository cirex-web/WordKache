import css from "./text.module.css";

export const Text = ({
  type,
  children,
  noWrap,
  bold,
  className,
  dark,
  style,
  onClick,
}: {
  type?: "paragraph" | "heading";
  children: React.ReactNode;
  noWrap?: boolean;
  bold?: boolean;
  className?: string;
  dark?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}) => {
  return (
    <span
      className={(type ? css[type] : "") + " " + className}
      style={{
        ...(noWrap
          ? {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }
          : {}),
        fontWeight: bold ? "bold" : "",
        color: dark ? "var(--dark-1)" : "inherit",
        ...style,
        
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
