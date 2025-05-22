"use strict";

import { countChars } from "@/lib/util";
import React, { useState, useEffect, useRef } from "react";

interface Props {
  field: {
    id: string;
    fields: (
      | {
          name: string;
          type: string;
          checked: boolean;
          disabled: boolean;
        }
      | {
          name: string;
          type: string;
          value: string | number | boolean;
          limit?: number;
        }
    )[];
  };

  isPublic: boolean;
  userLoggedIn: boolean;
  validate?: (
    id: string,
    value: string | number | boolean,
    onSave: boolean
  ) => Promise<{
    result: boolean;
    message?: string | undefined;
  }>;
  defaultEditMode?: boolean;
  change?: Function;
  editing?: Function;
  save: Function;
  default?: string;
  children?: React.ReactNode;
}

const EditableFields = (props: Props) => {
  const { field, isPublic, userLoggedIn, save } = props;

  const targetField = field.fields.find((f) => f.name === "value");
  const targetValue =
    targetField && "value" in targetField ? targetField.value : undefined;
  const limit = targetField && "value" in targetField ? `${targetField.limit} 文字` : "";

  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(() =>
    JSON.parse(JSON.stringify(field.fields))
  );
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    ""
  );
  const [textareaCounter, setTextareaCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputElements = useRef(new Array(field.fields.length));
  const selectElements = useRef(new Array(field.fields.length));

  const startEditing = () => {
    setSubmitDisabled(!props.defaultEditMode);
    console.log("startEditing");
    props.editing && props.editing();
    setIsEditing(true);
    setEditedFields(JSON.parse(JSON.stringify(field.fields)));
    console.log("editedFields", editedFields);
  };

  const handleChangeSelect = async (
    i: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFields = [...editedFields];
    const value = event.target.value;
    newFields[i] = {
      ...newFields[i],
      value: value,
    };
    setEditedFields(newFields);
    setSubmitDisabled(false);
  };

  const handleChangeCheckbox = async (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...editedFields];
    const checked = event.target.checked;

    newFields[i] = {
      ...newFields[i],
      checked: checked,
    };

    setEditedFields(newFields);
    setSubmitDisabled(false);
  };

  const handleChangeText = async (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...editedFields];
    const value = event.target.value;
    const validateResult = () => {
      if (targetValue !== value) {
        return props.validate && props.validate(props.field.id, value, false);
      } else {
        return { result: false, message: "" };
      }
    };

    newFields[i] = {
      ...newFields[i],
      value: value,
    };

    setEditedFields(newFields);

    if ((await validateResult())?.result === false) {
      setErrorMessage((await validateResult())?.message);
      setSubmitDisabled(true);
    } else {
      setErrorMessage("");
      setSubmitDisabled(false);
    }
  };

  const handleChangeTextarea = async (
    i: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newFields = [...editedFields];
    const value = event.target.value;
    const validateResult = () => {
      if (targetValue !== value) {
        return props.validate && props.validate(props.field.id, value, false);
      } else {
        return { result: false, message: "" };
      }
    };

    setTextareaCounter(countChars(value));

    newFields[i] = {
      ...newFields[i],
      value: value,
    };

    setEditedFields(newFields);

    if ((await validateResult())?.result === false) {
      setErrorMessage((await validateResult())?.message);
      setSubmitDisabled(true);
    } else {
      setErrorMessage("");
      setSubmitDisabled(false);
    }

  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const form = event.target as HTMLFormElement;
    const save = await props.save(form);
    if (save.result) {
      setIsEditing(false);
    } else {
      setErrorMessage(save.message);
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (targetValue && (targetValue === "" || props?.defaultEditMode)) {
      startEditing();
    } else {
      cancelEdit();
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      setEditedFields(JSON.parse(JSON.stringify(field.fields)));
      setTextareaCounter(countChars(targetValue as string));
    }
  }, [isEditing, field.fields]);

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      )
      :
      isEditing && props.userLoggedIn ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSave(event);
          }}
        >
          {editedFields?.map(
            (
              fieldData: {
                name: string;
                type: string;
                //selectName: string | undefined;
                value: string | number | boolean | undefined;
                checked: boolean;
                options: any[];
                disabled: boolean | undefined;
                label:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | React.PromiseLikeOfReactNode
                  | null
                  | undefined;
              },
              i: React.Key | null | undefined
            ) => {
              switch (fieldData.type) {
                case "select":
                  return (
                    <select
                      key={i}
                      name={`${field.id}-${fieldData.name}`}
                      id={`editable-select-${field.id}-${fieldData.name}`}
                      ref={(el) => (selectElements.current[i as number] = el)}
                      value={fieldData.value as number}
                      onChange={(e) => handleChangeSelect(i as number, e)}
                    >
                      {props.default && (
                        <option key={0} value={props.default}>
                          -----
                        </option>
                      )}
                      {fieldData.options?.map(
                        (
                          option: {
                            code:
                              | string
                              | number
                              | readonly string[]
                              | undefined;
                            label: Record<string, string>;
                          },
                          j: React.Key | null | undefined
                        ) => (
                          <option key={j} value={option.code}>
                            {option.label["ja"]}
                          </option>
                        )
                      )}
                    </select>
                  );
                  break;

                case "checkbox":
                  return (
                    <div key={i}>
                      {
                        <input
                          type="checkbox"
                          name={`${field.id}-${fieldData.name}`}
                          id={`editable-input-${field.id}-${fieldData.name}`}
                          disabled={fieldData.disabled}
                          ref={(el) =>
                            (inputElements.current[i as number] = el)
                          }
                          checked={fieldData.checked}
                          onChange={(e) => handleChangeCheckbox(i as number, e)}
                        />
                      }
                      {fieldData.label && (
                        <label htmlFor={`editable-input-${field.id}`}>
                          {fieldData.label}
                        </label>
                      )}
                    </div>
                  );
                  break;
                case "radio":
                  return (
                    <div key={i}>
                      {fieldData.options.map(
                        (
                          option: {
                            value:
                              | string
                              | number
                              | readonly string[]
                              | undefined;
                            label:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | React.PromiseLikeOfReactNode
                              | null
                              | undefined;
                          },
                          j: React.Key | null | undefined
                        ) => (
                          <label key={j}>{option.label}</label>
                        )
                      )}
                    </div>
                  );
                  break;
                case "date":
                  return (
                    <div key={i}>
                      {
                        <input
                          type="date"
                          name={`${field.id}-${fieldData.name}`}
                          id={`editable-input-${field.id}-${fieldData.name}`}
                          ref={(el) =>
                            (inputElements.current[i as number] = el)
                          }
                          value={fieldData.value as string}
                          onChange={(e) => handleChangeText(i as number, e)}
                        />
                      }
                      {errorMessage !== "" && <p>{errorMessage}</p>}
                    </div>
                  );
                  break;
                case "textarea":
                  return (
                    <div key={i}>
                      {
                        <textarea
                          name={`${field.id}-${fieldData.name}`}
                          id={`editable-textarea-${field.id}-${fieldData.name}`}
                          ref={(el) =>
                            (inputElements.current[i as number] = el)
                          }
                          value={(fieldData.value as string) ?? ""}
                          onChange={(e) => handleChangeTextarea(i as number, e)}
                        />
                      }
                      {textareaCounter}/{limit}

                      {errorMessage !== "" && <p>{errorMessage}</p>}
                    </div>
                  );
                  break;
                default:
                  return (
                    <div key={i}>
                      {
                        <input
                          type="text"
                          name={`${field.id}-${fieldData.name}`}
                          id={`editable-input-${field.id}-${fieldData.name}`}
                          ref={(el) =>
                            (inputElements.current[i as number] = el)
                          }
                          value={(fieldData.value as string) ?? ""}
                          onChange={(e) => handleChangeText(i as number, e)}
                        />
                      }
                      {errorMessage !== "" && <p>{errorMessage}</p>}
                    </div>
                  );
                  break;
              }
            }
          )}
          <button type="submit" disabled={submitDisabled}>
            Save
          </button>
          {!props.defaultEditMode && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>
      ) 
      : userLoggedIn ? (
        // Button to start editing
        <>
          {props.children}
          <button onClick={startEditing}>Edit</button>
        </>
      )
      : null}
    </>
  );
};

export default EditableFields;
