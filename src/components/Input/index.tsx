import { ForwardedRef, Ref, SelectHTMLAttributes, forwardRef } from "react";
import css from "./index.module.scss";
import classNames from "classnames";

interface IInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  underline?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, underline, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        className={classNames(css.input, className, {
          [css.underline]: underline,
        })}
      ></input>
    );
  }
);

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>, ref) => {
  return (
    <select
      ref={ref}
      {...rest}
      className={classNames(css.select, className)}
    ></select>
  );
});
