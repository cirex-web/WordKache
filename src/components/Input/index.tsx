import { forwardRef } from "react";
import css from "./index.module.scss";
import classNames from "classnames";

interface IInputProps extends React.ComponentProps<"input"> {
  underline?: boolean;
  fullWidth?: boolean;
}

interface ISelectProps extends React.ComponentProps<"select"> {
  fullWidth?: boolean;
}
export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, underline, fullWidth, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        className={classNames(css.input, className, {
          [css.underline]: underline,
          [css.fullWidth]: fullWidth,
        })}
      ></input>
    );
  }
);

export const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  ({ className, fullWidth, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        {...rest}
        className={classNames(css.select, className, {
          [css.fullWidth]: fullWidth,
        })}
      ></select>
    );
  }
);
