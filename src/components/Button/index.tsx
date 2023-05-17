import classNames from "classnames/bind";
import css from "./index.module.scss";
interface IButtonProps extends React.ComponentProps<"button"> {
  noBorder?: boolean;
  zoomOnHover?: boolean;
}

export const Button = ({
  className,
  noBorder,
  zoomOnHover,
  ...rest
}: IButtonProps) => {
  return (
    <button
      {...rest}
      className={classNames.bind(css)(
        "button",
        {
          noBorder: noBorder,
          zoomButton: zoomOnHover,
        },
        className
      )}
    ></button>
  );
};
