import css from "./text.module.css";

interface ITextProps extends React.HTMLProps<HTMLSpanElement> {
  type?: "paragraph" | "heading" | "subheading";
  noWrap?: boolean;
  bold?: boolean;
  dark?: boolean;
  noSelect?: boolean;
  /** Light gray basically */
  dull?: boolean;
}

export const Text = ({
  type,
  children,
  noWrap,
  bold,
  dark,
  dull,
  style,
  className,
  noSelect,
  ...rest
}: ITextProps) => {
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
        color: dark ? "var(--dark-1)" : dull ? "var(--light-2)" : "",
        userSelect: noSelect ? "none" : "auto",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
};
