import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import css from "./index.module.css";
export const TableHeader = () => {
  return (
    <div className={css.header}>
      <Text type="heading">
        Just Collected
        <div className={css.buttons}>
          <Icon name="ios_share" />
        </div>
      </Text>
    </div>
  );
};
