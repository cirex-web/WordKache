import { Card } from "../../../storageTypes";
import css from "./index.module.css";
export const WordPanel = ({
  cardInfo,
  onSave,
}: {
  cardInfo: Card;
  onSave: () => void;
}) => {
  return (
    <div className={css.container}>
      <button onClick={onSave}>Save</button>
    </div>
  );
};
