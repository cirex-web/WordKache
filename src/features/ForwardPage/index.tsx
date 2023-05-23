import { useState } from "react";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Folder, Filter } from "../../types/storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { useFilters } from "../../utils/storage/filters";
import { nanoid } from "nanoid";
import { Input } from "../../components/Input";
import { getFormConfig } from "./formConfig";

interface IGeneralInputProps {
  name: string;
  update: (key: string, val: any) => void;
  defaultValue: string;
  required?: boolean;
  keyInd?: number;
}
interface ISelectProps extends IGeneralInputProps {
  options: { value: string; text: string }[];
}
interface IInputProps extends IGeneralInputProps {
  parse: (val: string) => any;
}
const FormInput = ({ name, update, parse, defaultValue, keyInd }: IInputProps) => {
  return (
    <Input
      name={name}
      defaultValue={defaultValue}
      onChange={(ev) => {
        const textValue = ev.target.value;
        const parsedVal = textValue.length === 0 ? "" : parse(ev.target.value); //if the textbox is empty, count it as valid input
        update(name, parsedVal);
      }}
      className ={css.filterInput}
      key = {keyInd}
    />
  );
};
const FormSelect = ({ options, name, update, defaultValue, keyInd }: ISelectProps) => {
  return (
    <select
      name={name}
      onChange={(ev) => update(name, ev.target.value)}
      defaultValue={defaultValue}
      className ={css.filterInput}
      key = {keyInd}
    >
      {options.map(({ value, text }) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  );
};

export const ForwardingPage = ({ folders }: { folders: Folder[] }) => {
  const filters = useFilters();
  const formConfig = getFormConfig(folders);
  const [inputData, setInputData] = useState<{
    /** If undefined, it means that whatever's in the input is invalid */
    [name: string]: any;
  }>(
    formConfig.flat().reduce((obj, curInput) => {
      return {
        ...obj,
        [curInput.name]: curInput.defaultValue,
      };
    }, {})
  );
  const [selectedFilter, setSelectedFilter] = useState<Filter[]>([]);

  const updateInputData = (name: string, val: any) => {
    setInputData({ ...inputData, [name]: val });
  };

  const [expand, setExpand] = useState<boolean>(true);

  const createFilter = (): string => {
    const newFilter: Filter = {
      //TODO: some stricter type checking
      destination: inputData.destination,
      frontLang: inputData.frontLang,
      backLang: inputData.backLang,
      words: inputData.words,
      length: {
        direction: inputData.lengthDirection,
        number: inputData.length,
      },
      id: nanoid(),
    };

    filters.addFilter(newFilter);
    return "Added Filter";
  };

  const handleBackspace = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Backspace") {
      filters.deleteFilters(selectedFilter.map((filter) => filter.id));
      setSelectedFilter([]);
    }
  };
  const validated = Object.values(inputData).every((data) => !!data);

  return (
    <div className={css.container} tabIndex={0} onKeyDown={handleBackspace}>
      <div className={css.header}>
        <Text type="heading" bold noWrap className={css.heading}>
          Filters
        </Text>
      </div>
      <div className={css.content}>
        <Text type="heading" lineHeight={0.5} bold>
          Create Filter
          <Icon
            name="expand_more"
            style={{
              transform: `rotate(${expand ? 0 : -90}deg)`,
              transition: ".2s transform",
              verticalAlign: "middle",
            }}
            onMouseDown={() => setExpand(!expand)}
          />
        </Text>
        <div style={{ height: expand ? "100%" : 0 }} className={css.addFilter}>
          <Text type="paragraph">
            {formConfig.map((inputs) => {
              if (!inputs.length) return undefined;
              return (
                <div className = {css.smallGrid}>
                  {inputs.map((input, ind) => {
                    <label htmlFor={input.name}>{input.name}</label>
                    return input.type === "select" ? (
                      <FormSelect {...input} update={updateInputData} key = {ind} keyInd={ind}/>
                    ) : (
                      <FormInput update={updateInputData} {...input} key = {ind} keyInd={ind}/>
                    );
                  })}
                </div>
              );
            })}
            {/*<div className={css.smallGrid}>
              <span className={css.required}>*</span>
              <span>Destination</span>
              <select
                className={css.filterInput}
                onChange={(ev) => setDestination(ev.target.value)}
              >
                <option value="">Select An Option</option>
                {folders
                  .filter((folder) => folder.id !== curFolder)
                  .map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
              </select>
              <span />
              Front Language{" "}
              <input
                className={css.filterInput}
                placeholder="ISO6391 2 digit standard"
                onChange={(ev) => setFrontLang(ev.target.value)}
              />{" "}
              <span />
              Back Language{" "}
              <input
                className={css.filterInput}
                placeholder="ISO6391 2 digit standard"
                onChange={(ev) => setBackLang(ev.target.value)}
              />
              <span />
              Has The Words{" "}
              <input
                className={css.filterInput}
                placeholder="Seperate With Spaces"
                onChange={(ev) => setWords(" " + ev.target.value)}
              />
              
            </div>
            <div className={css.bigGrid}>
              Length
              <select
                className={css.filterInput}
                onChange={(ev) => setComparison(ev.target.value)}
              >
                <option value=">">greater than</option>
                <option value="<">less than</option>
              </select>
              <input
                className={css.filterInput}
                placeholder="Number of Characters"
                onChange={(ev) => setSize(ev.target.value)}
              />
            </div>*/}
          </Text>

          <div className={css.submit}>
            <Button
              zoomOnHover
              disabled={!validated}
              onMouseDown={() => alert(createFilter())}
            >
              <Text
                type="heading"
                style={{ color: validated ? "white" : "gray" }}
              >
                Create Filter
              </Text>
            </Button>
          </div>
        </div>
        <FilterTable
          filters={filters.filters === undefined ? [] : filters.filters}
          folders={folders}
        />
      </div>
    </div>
  );
};
