import { Text } from "../Text";
import css from "./index.module.css";
/**
 * The primary block header that appears at the top
 */
export const Header = ({
  children,
  headingText = "​" /*This is a zero-width space. It's not empty. This is done so that the heading doesn't collapse on itself when there's no text*/,
}: {
  children?: React.ReactNode;
  headingText?: string;
}) => {
  return (
    <div className={css.header}>
      <Text type="heading" bold noWrap className={css.heading}>
        {headingText}
        <span className={css.buttonTray}>{children}</span>
      </Text>
    </div>
  );
};
