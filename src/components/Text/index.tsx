import classNames from "classnames";
import css from "./text.module.css";

interface ITextProps extends React.HTMLProps<HTMLDivElement> {
  type?: "paragraph" | "heading" | "subheading" | "xLargeHeading";
  noWrap?: boolean;
  bold?: boolean;
  dark?: boolean;
  noSelect?: boolean;
  /** Light gray basically */
  dull?: boolean;
  lineHeight?: number;
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
  lineHeight,
  ...rest
}: ITextProps) => {
  return (
    <div
      className={classNames(type && css[type], className)}
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
        lineHeight,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
