"use strict";
import React, { useState, useEffect, useRef } from "react";

interface Props {
  field: {
    id: string;
    //collectionName: string;
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
  save: Function;
  //startEditing: Function;
  children?: React.ReactNode;
}

const EditableFields = (props: Props) => {
  const { field, isPublic, userLoggedIn, save } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(() =>
    JSON.parse(JSON.stringify(field.fields))
  );
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    ""
  );
  const inputElements = useRef(new Array(field.fields.length));
  const selectElements = useRef(new Array(field.fields.length));
  const startEditing = () => {
    //props.startEditing();
    setIsEditing(true);
    setEditedFields(JSON.parse(JSON.stringify(field.fields)));
    console.log("editedFields",editedFields)
  };

  const handleChangeSelect = async (
    i: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    //const prevFields = field.fields;
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
    const prevFields = field.fields;
    const newFields = [...editedFields];
    const value = event.target.value;
    const validate = (saveOnly: boolean) => {
      if (prevFields !== newFields) {
        return (
          props.validate && props.validate(props.field.id, value, saveOnly)
        );
      }
    };
    const validateResult = validate(false);

    newFields[i] = {
      ...newFields[i],
      value: value,
    };

    setEditedFields(newFields);

    if (validateResult && (await validateResult).result === false) {
      setErrorMessage((await validateResult)?.message);
      setSubmitDisabled(false);
    } else {
      setErrorMessage("");
      setSubmitDisabled(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.target as HTMLFormElement;
    const save = await props.save(form);
    if (save.result) {
      setIsEditing(false);
    } else {
      setErrorMessage(save.message);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const value = field.fields.find((field) => field.name === "value")?.value;
    if (value === "") {
      startEditing();
    } else {
      cancelEdit();
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      setEditedFields(JSON.parse(JSON.stringify(field.fields)));
    }
  }, [isEditing, field.fields]);

  return (
    <>
      {isEditing && props.userLoggedIn ? (
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
                      onChange={e => handleChangeSelect(i as number, e)}
                    >
                      {fieldData.options.map(
                        (
                          option: {
                            code: string | number | readonly string[] | undefined;
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
                        ref={(el) => (inputElements.current[i as number] = el)}
                        checked={fieldData.checked}
                        onChange={e => handleChangeCheckbox(i as number, e)}
                      />}
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
                          <label key={j}>
                            {/*
                            <input
                              type="radio"
                              name={`editable-input-${i}`}
                              id={`editable-input-${i}-${j}`}
                              ref={(el) =>
                                (inputElements.current[`${i}-${j}`] = el)
                              }
                              value={option.value}
                              checked={fieldData.value === option.value}
                              onChange={}
                            />*/}
                            {option.label}
                          </label>
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
                          value={fieldData.value as string ?? ""}
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
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      ) : userLoggedIn ? (
        // Button to start editing
        <>
          {props.children}
          <button onClick={startEditing}>Edit</button>
        </>
      ) : isPublic ? (
        // Display for public view
        <>{props.children}</>
      ) : null}
    </>
  );
};

export default EditableFields;
