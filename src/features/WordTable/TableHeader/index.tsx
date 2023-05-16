import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { saveFlashcards } from "../../../utils/file";
import { Card } from "../../../storageTypes";
import { Button } from "../../../components/Button";
import { useFocus } from "../../../utils/useFocus";
import classNames from "classnames";

export const TableHeader = ({
  folderName,
  setSearchInput,
  handleFilters,
  filteredCards,
  rawCards,
}: {
  folderName: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleFilters: Function;//giving me key error, if you know problem pls fix
  filteredCards: Card[];
  rawCards: Card[];
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [inputRef] = useFocus();

  const frontLans = Array.from(new Set(rawCards.map((card) => card.front.lang)));
  const backLans = Array.from(new Set(rawCards.map((card) => card.back.lang)));

  const languageTable = () => {
    return (
    <>
    <tr>
      <th><Text type = "heading">Front</Text></th>
      <th><Text type = "heading">Back</Text></th>
    </tr>
    {Array.from(Array(Math.max(frontLans.length,backLans.length))).map((e, i) => (
      <tr>
        { i < frontLans.length ?
        <td>
          <label>
          <input type = "checkbox" value = {frontLans[i]} onChange = {(event) => {event.target.checked ? handleFilters(event.target.value, "frontAdd"): handleFilters(event.target.value, "frontDelete")}}/> 
          <Text type = "paragraph">{frontLans[i]}</Text>
          </label>
        </td>
        : <td></td>
        }
        { i < backLans.length ? 
        <td>
          <label>
          <input type = "checkbox" value = {backLans[i]} onChange = {(event) => {event.target.checked ? handleFilters(event.target.value, "backAdd"): handleFilters(event.target.value, "backDelete")}}/> 
          <Text type = "paragraph">{backLans[i]}</Text>
          </label>
        </td>
        : <td></td>
        }
      </tr>
    ))}
    </>
    )
    
  }

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
            <div className = {css.container}>
              <div
                className={classNames(css.dropDown, dropOpen? css.open: css.closed)}
              >
                <table className = {css.filterBody}><tbody>
                  {languageTable()}  
                </tbody></table>
              </div>
            </div>
            <Button
              noBorder
              onMouseDown={() => {
                // if (!inputOpen) focusInput(); //focus input on open
                setInputOpen(!inputOpen);
              }}
              zoomOnHover
            >
              <Icon name="search" />
            </Button>

            <Button
              noBorder
              zoomOnHover
              onMouseDown={() => {
                setDropOpen(!dropOpen);
              }}
              disabled={!filteredCards.length}
              style={{ marginLeft: "-5px" }}
            >
              <Icon name= "Filter_Alt"/>
            </Button>

            <Button
              onMouseDown={() => saveFlashcards(folderName, filteredCards)}
              noBorder
              zoomOnHover
              style={{ marginLeft: "-5px" }}
              disabled={!filteredCards.length}
            >
              <Icon name="download" />
            </Button>
          </div>
        </span>
      </Text>
    </div>
  );
};
