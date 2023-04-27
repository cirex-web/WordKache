import css from "./text.module.css";

export const Text = ({
  type,
  children,
  noWrap,
  bold,
  className,
  dark,
  padding
}: {
  type: "paragraph" | "heading";
  children: React.ReactNode;
  noWrap?: boolean;
  bold?: boolean;
  className?: string;
  dark?: boolean;
  padding?:string
}) => {
  return (
    <div
      className={css[type] + " " + className}
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
        padding
      }}
    >
      {children}
    </div>
  );
};
