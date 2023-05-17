import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Text } from "../../../components/Text";
import css from "./index.module.scss";
import { saveFlashcards, copyFlashcards } from "../../../utils/file";
import { Card } from "../../../storageTypes";
import { Button } from "../../../components/Button";
import { useFocus } from "../../../utils/useFocus";
import classNames from "classnames";

const LanguageTable = ({
  handleFilters,
  frontLangs,
  backLangs,
}: {
  handleFilters: Function;
  frontLangs: string[];
  backLangs: string[];
}) => {
  return (
    <>
      <tr>
        <th>
          <Text type="heading">Front</Text>
        </th>
        <th>
          <Text type="heading">Back</Text>
        </th>
      </tr>
      {Array.from(Array(Math.max(frontLangs.length, backLangs.length))).map(
        (e, i) => (
          <tr>
            {i < frontLangs.length ? (
              <td>
                <label>
                  <input
                    type="checkbox"
                    value={frontLangs[i]}
                    onChange={(event) => {
                      event.target.checked
                        ? handleFilters(event.target.value, "frontAdd")
                        : handleFilters(event.target.value, "frontDelete");
                    }}
                  />
                  <Text type="paragraph">{frontLangs[i]}</Text>
                </label>
              </td>
            ) : (
              <td></td>
            )}
            {i < backLangs.length ? (
              <td>
                <label>
                  <input
                    type="checkbox"
                    value={backLangs[i]}
                    onChange={(event) => {
                      event.target.checked
                        ? handleFilters(event.target.value, "backAdd")
                        : handleFilters(event.target.value, "backDelete");
                    }}
                  />
                  <Text type="paragraph">{backLangs[i]}</Text>
                </label>
              </td>
            ) : (
              <td></td>
            )}
          </tr>
        )
      )}
    </>
  );
};
export const TableHeader = ({
  folderName,
  setSearchInput,
  cards,
  filteredCards,
  handleFilters,
}: {
  folderName: string;
  handleFilters: Function; //giving me key error, if you know problem pls fix
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  cards: Card[];
  filteredCards: Card[]; //NOTE: awful lot of prop drilling (maybe use a context?)
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [inputRef] = useFocus();

  const frontLangs = Array.from(new Set(cards.map((card) => card.front.lang)));
  const backLangs = Array.from(new Set(cards.map((card) => card.back.lang)));

  return (
    <div className={css.header}>
      <Text type="heading" bold noWrap className={css.heading}>
        {folderName}
        <span className={css.buttonsTray}>
          <div className={css.buttons}>
            <div
              className={css.inputContainer}
              style={{ flexGrow: inputOpen ? 1 : 0 }}
            >
              <Input
                placeholder="Search cards..."
                onChange={(event) => setSearchInput(event.currentTarget.value)}
                ref={inputRef}
              />
            </div>

            <Button
              onMouseDown={() => {
                // if (!inputOpen) focusInput(); //focus input on open
                setInputOpen(!inputOpen);
              }}
              zoomOnHover
              disabled={!cards.length}
              className={css.icon}
            >
              <Icon name="search" />
            </Button>

            <Button
              zoomOnHover
              onMouseDown={() => {
                setDropOpen(!dropOpen);
              }}
              disabled={!filteredCards.length}
              className={css.filterButtonContainer}
            >
              <Icon name="Filter_Alt" />
              <div
                className={classNames(
                  css.dropdown,
                  dropOpen ? css.open : css.closed
                )}
              >
                <table className={css.filterBody}>
                  <tbody>
                    <LanguageTable
                      handleFilters={handleFilters}
                      frontLangs={frontLangs}
                      backLangs={backLangs}
                    />
                  </tbody>
                </table>
              </div>
            </Button>

            <Button
              onMouseDown={(event) =>
                event.shiftKey || event.metaKey
                  ? copyFlashcards(filteredCards)
                  : saveFlashcards(folderName, filteredCards)
              }
              zoomOnHover
              disabled={!filteredCards.length}
              className={css.icon}
            >
              <Icon name="download" />
            </Button>
          </div>
        </span>
      </Text>
    </div>
  );
};
