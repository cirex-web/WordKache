import { forwardRef } from "react";
import css from "./index.module.css";

export const Input = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      {...rest}
      className={css.input + " " + (className ?? "")}
    ></input>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
>(({ className, ...rest }, ref) => {
  return (
    <select
      ref={ref}
      {...rest}
      className={css.select + " " + (className ?? "")}
    ></select>
  );
});
