import css from "./App.module.scss";
import WordTable from "./WordTable";
import { FolderNav } from "./FolderNav";
// import { ForwardingPage } from "./ForwardPage";
import logo from "../assets/logo.svg";
import { useCards } from "../utils/storage/cards";
import { UserManual } from "./UserManual";
import { useFolderNavContext } from "../contexts/FolderNavProvider";

function App() {
  const { cards, moveCards, deleteCards } = useCards();
  const { activeFolderId } = useFolderNavContext();
  return (
    <div className={css.root}>
      <div className={css.menu}>
        <img src={logo} className={css.logo} alt="logo" />
        <FolderNav />
      </div>
      {activeFolderId !== undefined &&
        (activeFolderId === null ? (
          // <ForwardingPage key="filters" />
          <UserManual />
        ) : (
          cards && (
            <WordTable
              key={activeFolderId} /* So it re-renders everything */
              deleteCards={deleteCards}
              moveCards={moveCards}
              cards={cards}
            />
          )
        ))}
    </div>
  );
}

export default App;
