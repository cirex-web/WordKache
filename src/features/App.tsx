import css from "./App.module.scss";
import WordTable from "./WordTable";
import { FolderNav } from "./FolderNav";
import { ForwardingPage } from "./ForwardPage";
import logo from "../assets/logo.svg";
import { useCards } from "../utils/storage/cards";
import { UserManual } from "./UserManual";
import {
  useFolderContext,
} from "../contexts/FolderProvider";
import { FolderNavContextProvider } from "../contexts/FolderNavProvider";

function App() {
  const { cards, moveCards, deleteCards } = useCards();
  const cardsUnderCurrentFolder = cards?.filter(
    (card) => card.location === activeFolderId && !card.hidden && !card.deleted //top-level filtering
  );

  return (
    <>
      <div className={css.menu}>
        <img src={logo} className={css.logo} alt="logo" />
        <FolderNavContextProvider>
          <FolderNav />
        </FolderNavContextProvider>

        <UserManual
          numCardsHidden={
            cards
              ? cards.reduce<number>((sum, card) => sum + +!!card.hidden, 0)
              : 0
          }
        />
      </div>
      {!activeFolderId.length ? (
        <ForwardingPage key="filters" />
      ) : (
        cardsUnderCurrentFolder && (
          <WordTable
            cards={cardsUnderCurrentFolder}
            moveCards={moveCards}
            key={activeFolderId}
            deleteCards={deleteCards}
          />
        )
      )}
    </>
  );
}

export default App;
