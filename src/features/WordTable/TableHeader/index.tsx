import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
export const TableHeader = ({ folderName }: { folderName: string }) => {
  return (
    <div className={css.header}>
      <Text type="heading" bold noWrap className={css.heading}>
        {folderName}
        <span className={css.buttonsTray}>
          <div className={css.buttons}>
            <Icon name="search" />

            <Icon name="ios_share" />
          </div>
        </span>
      </Text>
    </div>
  );
};
