import { forwardRef } from "react";
import css from "./index.module.css";
interface IInputProps extends React.HTMLProps<HTMLInputElement> {}
export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        className={css.input + " " + (className ?? "")}
      ></input>
    );
  }
);
