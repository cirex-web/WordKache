import React, {
  ComponentPropsWithoutRef,
  SelectHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Folder, Filter } from "../../types/storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { useFilters } from "../../utils/storage/filters";
import { nanoid } from "nanoid";
import { Input, Select } from "../../components/Input";
import { getFormConfig } from "./formConfig";
import { Header } from "../../components/Header";

interface IGeneralInputProps {
  update: (key: string, val: any) => void;
  required?: boolean;
  keyInd?: number;
}
interface ISelectProps
  extends IGeneralInputProps,
    React.ComponentPropsWithoutRef<"select"> {
  options: { value: string; text: string }[];
  name: string;
}
interface IInputProps
  extends IGeneralInputProps,
    ComponentPropsWithoutRef<"input"> {
  parse: (val: string) => any;
  placeholder: string;
  name: string;
}
const FormInput = ({
  name,
  update,
  parse,
  defaultValue,
  placeholder,
}: IInputProps) => {
  return (
    <Input
      name={name}
      defaultValue={defaultValue}
      onChange={(ev) => {
        const textValue = ev.target.value;
        const parsedVal = textValue.length === 0 ? "" : parse(ev.target.value); //if the textbox is empty, count it as valid input
        update(name, parsedVal);
      }}
      placeholder={placeholder}
      underline
    />
  );
};

const FormSelect = forwardRef<HTMLSelectElement, ISelectProps>(
  ({ options, name, update, ...rest }, ref) => {
    return (
      <Select
        name={name}
        onChange={(ev) => update(name, ev.target.value)}
        ref={ref}
        {...rest}
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </Select>
    );
  }
);

export const ForwardingPage = ({ folders }: { folders: Folder[] }) => {
  const { filters, addFilter, deleteFilters } = useFilters();
  const formConfig = getFormConfig(folders);
  const [inputData, setInputData] = useState<{
    /** If undefined, it means that whatever's in the input is invalid */
    [name: string]: { value: any; required: boolean };
  }>(
    formConfig
      .map((form) =>
        form.inputs.map((inputConfig) => {
          return { ...inputConfig, required: form.required }; //pass down the required property into the inputs
        })
      )
      .flat()
      .reduce((obj, curInput) => {
        return {
          ...obj,
          [curInput.name]: {
            value: curInput.defaultValue,
            required: curInput.required,
          },
        };
      }, {})
  );

  const [selectedFilter, setSelectedFilter] = useState<Filter[]>([]);

  const updateInputData = (name: string, val: any) => {
    setInputData({
      ...inputData,
      [name]: { value: val, required: inputData[name].required },
    });
  };

  const [expand, setExpand] = useState(true);

  const createFilter = (): string => {
    const newFilter: Filter = {
      //TODO: some stricter type checking
      destination: inputData.destination.value,
      frontLang: inputData.frontLang.value,
      backLang: inputData.backLang.value,
      words: inputData.words.value,
      length: {
        direction: inputData.lengthDirection.value,
        number: inputData.length.value,
      },
      id: nanoid(),
    };

    addFilter(newFilter);
    return "Added Filter";
  };

  const handleBackspace = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Backspace") {
      deleteFilters(selectedFilter.map((filter) => filter.id));
      setSelectedFilter([]);
    }
  };
  const validated = Object.values(inputData).every(
    (data) => !!data.value || !data.required
  );

  return (
    <div className={css.container} tabIndex={0} onKeyDown={handleBackspace}>
      <Header headingText="Filters" />
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
          <Text type="paragraph" className={css.smallGrid}>
            {formConfig.map((rowConfig, i) => {
              if (!rowConfig.inputs.length) return undefined;
              return (
                <>
                  <label
                    htmlFor={rowConfig.displayName}
                    key={rowConfig.displayName + "_text"}
                  >
                    {rowConfig.displayName}
                    {rowConfig.required && (
                      <span className={css.required}>*</span>
                    )}
                  </label>
                  <div
                    style={{ display: "flex", gap: "10px" }}
                    key={rowConfig.displayName + "_input"}
                  >
                    {rowConfig.inputs.map((input) => {
                      if (input.type === "select")
                        return (
                          <FormSelect
                            {...input}
                            update={updateInputData}
                            key={i}
                            id={rowConfig.displayName}
                          />
                        );
                      else
                        return (
                          <FormInput
                            {...input}
                            update={updateInputData}
                            key={i}
                            id={rowConfig.displayName}
                          />
                        );
                    })}
                  </div>
                </>
              );
            })}
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
          filters={filters === undefined ? [] : filters}
          folders={folders}
        />
      </div>
    </div>
  );
};
