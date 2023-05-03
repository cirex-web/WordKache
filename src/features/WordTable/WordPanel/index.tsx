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
      <button onClick={saveCard}>Save</button>
      <button onClick={deleteCard}>Delete</button>
    </div>
  );
};
