import classNames from "classnames/bind";
import css from "./index.module.scss";
interface IButtonProps extends React.ComponentProps<"button"> {
  zoomOnHover?: boolean;
}

export const Button = ({
  className,
  zoomOnHover,
  ...rest
}: IButtonProps) => {
  return (
    <button
      {...rest}
      className={classNames.bind(css)(
        "button",
        {
          zoomButton: zoomOnHover,
        },
        className
      )}
    ></button>
  );
};
