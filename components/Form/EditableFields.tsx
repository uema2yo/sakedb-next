import React, { useState, useRef } from "react";

interface Props {
  field: {
    id: string;
    collectionName: string;
    fields: [
      {
        name: string;
        type: string;
        value: string;
        disabled: boolean;
        label: string;
      },
      { name: string; type: string; value: string }
    ];
  };
  isPublic: boolean;
  isUserLoggedIn: boolean;
  save: Function;
  startEditing: Function;
}

const EditableFields = (props: Props) => {
	const { field, isPublic, isUserLoggedIn, save } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isCompositionInProgress, setIsCompositionInProgress] = useState(false);
  const [editedFields, setEditedFields] = useState(() =>
    JSON.parse(JSON.stringify(field.fields))
  );
  const inputElements = useRef(new Array(field.fields.length));

  const startEditing = () => {
    props.startEditing();
		// Implement your logic here
    setIsEditing(true);
    setEditedFields(JSON.parse(JSON.stringify(field.fields)));
    setIsCompositionInProgress(false);

    // Additional logic if required
  };

  const saveFields = () => {
    
  }
  
  const cancelEdit = () => {

  }

  return (
    <>
      {isEditing && props.isUserLoggedIn ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            saveFields();
          }}
        >
          {editedFields.map(
            (
              fieldData: {
                type: string;
                selectName: string | undefined;
                value:
                  | string
                  | number
                  | boolean
                  | readonly string[]
                  | undefined;
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
                    {/*
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
                    </select> */}
                  );
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
                  return (
                    {/*
                    <input
                      key={i}
                      type="date"
                      id={`editable-input-${i}`}
                      ref={(el) => (inputElements.current[i] = el)}
                      value={fieldData.value}
                      onKeyDown={(e) => e.key === "Enter" && saveFields()}
                      onChange={}
                    />*/}
                  );
                default:
                  return (
                    {/*
                    <input
                      key={i}
                      type="text"
                      id={`editable-input-${i}`}
                      ref={(el) => (inputElements.current[i] = el)}
                      value={fieldData.value}
                      onKeyDown={(e) => e.key === "Enter" && saveFields()}
                      onChange={}
                    />*/}
                  );
              }
            }
          )}
          <button type="submit">Save</button>
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      ) : isUserLoggedIn ? (
        // Button to start editing
        <button onClick={startEditing}>Edit</button>
      ) : isPublic ? (
        // Display for public view
        <div>Public Content</div>
      ) : null}
    </>
  );
};

export default EditableFields;
