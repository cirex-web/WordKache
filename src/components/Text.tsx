import css from "../styles/text.module.css";

export const Text = ({
  type,
  children,
}: {
  type: "paragraph" | "heading";
  children: string;
}) => {
  console.log(type);
  return <div className={css[type]}>{children}</div>;
};
