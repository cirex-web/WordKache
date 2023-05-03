import css from "./index.module.css";
interface IInputProps extends React.HTMLProps<HTMLInputElement> {}
export const Input = ({ className, ...rest }: IInputProps) => {
  return <input {...rest} className={css.input + " " + (className??"")}></input>;
};
