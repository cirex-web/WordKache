import React, { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { Filter } from "../../../types/storageTypes";
import { getFormConfig } from "./formConfig";
import { Input, Select } from "../../../components/Input";
import { nanoid } from "nanoid";
import { Text } from "../../../components/Text";
import css from "./index.module.scss";
import { Button } from "../../../components/Button";
import { UseFolderContext } from "../../App";

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
  const [inputValid, setInputValid] = useState(true);
  return (
    <Input
      name={name}
      defaultValue={defaultValue}
      onChange={(ev) => {
        const textValue = ev.target.value;
        const parsedVal = textValue.length === 0 ? "" : parse(ev.target.value); //if the textbox is empty, count it as valid input
        setInputValid(parsedVal !== undefined);
        if (!parsedVal) update(name, parsedVal);
      }}
      placeholder={placeholder}
      style={{ borderColor: !inputValid ? "var(--red-2)" : "" }}
      underline
      fullWidth
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
        fullWidth
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

export const FilterForm = ({
  addFilter,
}: {
  addFilter: (newFilter: Filter) => void;
}) => {
  const { folders } = UseFolderContext();
  const formConfig = getFormConfig(folders ?? []);

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
  const validated = Object.values(inputData).every(
    (data) => data.value !== undefined
  );
  const updateInputData = (name: string, val: any) => {
    setInputData({
      ...inputData,
      [name]: { value: val, required: inputData[name].required },
    });
  };

  const createFilter = () => {
    addFilter({
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
    });
  };
  return (
    <Text type="paragraph" className={css.formGrid}>
      {formConfig.map((rowConfig, i) => {
        if (!rowConfig.inputs.length) return undefined;
        return (
          <React.Fragment key={rowConfig.displayName}>
            <label htmlFor={rowConfig.displayName}>
              {rowConfig.displayName}
              {rowConfig.required && <span className={css.required}>*</span>}
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {rowConfig.inputs.map((input) => {
                if (input.type === "select")
                  return (
                    <FormSelect
                      {...input}
                      update={updateInputData}
                      key={input.name}
                      id={rowConfig.displayName}
                    />
                  );
                else
                  return (
                    <FormInput
                      {...input}
                      update={updateInputData}
                      key={input.name}
                      id={rowConfig.displayName}
                    />
                  );
              })}
            </div>
          </React.Fragment>
        );
      })}

      <Button
        disabled={!validated}
        onMouseDown={createFilter}
        className={css.submitButton}
      >
        <Text type="heading" style={{ color: validated ? "white" : "gray" }}>
          Create Filter
        </Text>
      </Button>
    </Text>
  );
};
