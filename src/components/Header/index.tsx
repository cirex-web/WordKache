import { Text } from "../Text";
import css from "./index.module.css";
/**
 * The primary block header that appears at the top
 */
export const Header = ({
  children,
  headingText,
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
