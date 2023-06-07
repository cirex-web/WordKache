import React, { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { Filter } from "../../../types/storageTypes";
import { getFormConfig } from "./formConfig";
import { Input, Select } from "../../../components/Input";
import { nanoid } from "nanoid";
import { Text } from "../../../components/Text";
import css from "./index.module.scss";
import { Button } from "../../../components/Button";
import { useFolderContext } from "../../../contexts/FolderProvider";

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
        const parsedVal =
          ev.target.value.length === 0 ? undefined : parse(ev.target.value);
        setInputValid(parsedVal !== null);
        update(name, parsedVal);
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
    const NOT_SELECTED_STRING = "_NOT_SELECTED_" + new Date();
    return (
      <Select
        name={name}
        onChange={(ev) =>
          update(
            name,
            ev.target.value === NOT_SELECTED_STRING
              ? undefined
              : ev.target.value
          )
        }
        ref={ref}
        fullWidth
        {...rest}
      >
        <option value={NOT_SELECTED_STRING}>Please select an option</option>
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
  const { folders } = useFolderContext();
  const formConfig = getFormConfig(folders ?? []);
  const defaultInputData = formConfig
    .map((form) =>
      form.inputs.map((inputConfig) => {
        return { ...inputConfig, required: form.required }; //pass down the required property into the inputs
      })
    )
    .flat() //some inputs are batched together into an array
    .reduce((obj, curInput) => {
      return {
        ...obj,
        [curInput.name]: {
          value: curInput.type === "input" ? curInput.defaultValue : undefined,
          required: curInput.required,
        },
      };
    }, {});
  const [updateFormKey, setUpdateFormKey] = useState(0);

  const [inputData, setInputData] = useState<{
    /** If undefined, it means that whatever's in the input is invalid */
    [name: string]: { value: any; required: boolean };
  }>(defaultInputData);

  const validated = Object.values(inputData).every(
    (data) =>
      data.value !== null && (!data.required || data.value !== undefined)
    //undefined means there's no value there, which is completely fine if it's not required. null means invalid input
  );
  const updateInputData = (name: string, val: any) => {
    setInputData({
      ...inputData,
      [name]: { value: val, required: inputData[name].required },
    });
  };
  console.log(JSON.stringify(inputData, undefined, 3));

  const createFilter = () => {
    addFilter({
      //TODO: some stricter type checking
      destination: inputData.destination.value,
      frontLang: inputData.frontLang.value,
      backLang: inputData.backLang.value,
      words: inputData.words.value,
      length:
        inputData.lengthDirection.value !== undefined &&
        inputData.length.value !== undefined
          ? {
              direction: inputData.lengthDirection.value,
              number: inputData.length.value,
            }
          : undefined,
      id: nanoid(),
    });
    setInputData(defaultInputData);
    setUpdateFormKey(updateFormKey + 1); //TODO: perhaps just pass the value down then lol
  };
  return (
    <div className={css.formContainer}>
      <Text type="paragraph" className={css.formGrid} key={updateFormKey}>
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
      </Text>
      <div className={css.submitButtonContainer}>
        <Button
          disabled={!validated}
          onMouseDown={createFilter}
          className={css.submitButton}
        >
          <Text type="heading" style={{ color: validated ? "white" : "gray" }}>
            Create Filter
          </Text>
        </Button>
      </div>
    </div>
  );
};
