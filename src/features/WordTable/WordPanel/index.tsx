import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { Card } from "../../../storageTypes";
import css from "./index.module.css";
export const WordPanel = ({
  cardInfo,
  saveCard,
  deleteCard,
}: {
  cardInfo: Card;
  saveCard: () => void;
  deleteCard: () => void;
}) => {
  return (
    <div className={css.container}>
      <Button onClick={saveCard}>
        <Text type="subheading">Save</Text>
      </Button>
      <Button onClick={deleteCard}>
        <Text type="subheading">Delete</Text>
      </Button>
    </div>
  );
};
