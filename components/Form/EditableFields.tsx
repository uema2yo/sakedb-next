"use strict";
import React, { useState, useEffect, useRef } from "react";
import type { ValidationErrorCode } from "@constants";
import { errorCodes } from "@apollo/client/invariantErrorCodes";

interface Props {
  field: {
    id: string;
    collectionName: string;
    fields: (
      | {
          name: string;
          type: string;
          value: string | number | boolean;
          disabled: boolean;
          label: string;
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
    value: string | number | boolean
  ) => Promise<{
    result: boolean;
    message?: string | undefined;
  }>;
  save: Function;
  startEditing: Function;
  children?: React.ReactNode;
}

const EditableFields = (props: Props) => {
  const { field, isPublic, userLoggedIn, save } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(() =>
    JSON.parse(JSON.stringify(field.fields))
  );
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>("");
  const inputElements = useRef(new Array(field.fields.length));

  const startEditing = () => {
    props.startEditing();
    setIsEditing(true);
    setEditedFields(JSON.parse(JSON.stringify(field.fields)));
  };

  const handleChangeText = async(i: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const prevFields = field.fields;
    const newFields = [...editedFields];
    const value = event.target.value;
    const validate = () => {
      if (prevFields !== newFields) {
        return props.validate && props.validate(props.field.id, value);
      }
    }
    const validateResult = validate();
    const errorMessage = (validateResult && (await validateResult).result === false) ?  (await validateResult)?.message : "";
    setErrorMessage(errorMessage);

    newFields[i] = {
      ...newFields[i],
      value: value,
    };
    setEditedFields(newFields);

  };

  const saveFields = async(event: React.FormEvent<HTMLFormElement>) => {
    const form = event.target as HTMLFormElement;
    await props.save(form);
    setIsEditing(false);
  }
  const cancelEdit = () => {
    setIsEditing(false);
  };

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
            saveFields(event);
          }}
        >
          {editedFields?.map(
            (
              fieldData: {
                type: string;
                selectName: string | undefined;
                value: string | number | undefined;
                chrcked: boolean;
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
                  return {
                    /*
                    <select
                      key={i}
                      id={`editable-input-${i}`}
                      name={fieldData.selectName}
                      ref={(el) => (inputElements.current[i] = el)}
                      value={fieldData.value}
                      onChange={}
                    >
                      {fieldData.options.map(
                        (
                          option: {
                            value:
                              | string
                              | number
                              | readonly string[]
                              | undefined;
                            innerText:
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
                          <option key={j} value={option.value}>
                            {option.innerText}
                          </option>
                        )
                      )}
                    </select> */
                  };
                case "checkbox":
                  return (
                    <div key={i}>
                      {/*
                      <input
                        type="checkbox"
                        id={`editable-input-${i}`}
                        disabled={fieldData.disabled}
                        ref={(el) => (inputElements.current[i] = el)}
                        checked={fieldData.value}
                        onChange={}
                      />*/}
                      {fieldData.label && (
                        <label htmlFor={`editable-input-${i}`}>
                          {fieldData.label}
                        </label>
                      )}
                    </div>
                  );
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
                case "date":
                  return {
                    /*
                    <input
                      key={i}
                      type="date"
                      id={`editable-input-${i}`}
                      ref={(el) => (inputElements.current[i] = el)}
                      value={fieldData.value}
                      onKeyDown={(e) => e.key === "Enter" && saveFields()}
                      onChange={}
                    />*/
                  };
                default:
                  return (
                    <div key={i}>
                      {
                        <input
                          type="text"
                          name={field.id}
                          id={`editable-input-${field.id}`}
                          ref={el => (inputElements.current[i as number] = el)}
                          value={fieldData.value ?? ""}
                          //onKeyDown={ e => e.key === "Enter" && saveFields()}
                          onChange={e => handleChangeText(i as number, e)}
                        />
                      }
                      {errorMessage !=="" && <p>{errorMessage}</p>}
                    </div>
                  );
              }
            }
          )}
          <button type="submit">Save</button>
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
