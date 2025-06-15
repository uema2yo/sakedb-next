"use strict";

import { countChars } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { SquarePen } from "lucide-react";

interface Props {
  field: {
    id: string;
    fields: (
      | {
          name: string;
          type: "checkbox";
          checked: boolean;
          disabled: boolean;
          label: string;
        }
      | {
          name: string;
          type: "switch";
          checked: boolean;
          disabled: boolean;
          label?: {on: string, off: string};
        }

        | {
          name: string;
          type: "select";
          value: string | number | boolean;
          options: {
            code: string | number | readonly string[] | undefined;
            label: Record<string, string>;
          }[];
          label?: string;
        }
      | {
          name: string;
          type: string;
          value: string | number | boolean;
          limit?: number;
          label?: string;
          disabled?: boolean;
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
  const limit =
    targetField && "limit" in targetField && typeof targetField.limit !== "undefined"
      ? `${targetField.limit} 文字`
      : "";

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
  const [switchLabel, setSwitchLabel] = useState("");

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
    
    setSwitchLabel(checked ? newFields[i].label?.on : newFields[i].label?.off);

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

  const handleSave = async (data: any) => {
    setLoading(true);
    const saveResult = await props.save(data);
    if (saveResult.result) {
      setIsEditing(false);
    } else {
      setErrorMessage(saveResult.message);
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
      setTextareaCounter(countChars(String(targetValue ?? "")));
    }
  }, [isEditing, field.fields]);

  const form = useForm();

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      )
      :
      isEditing && props.userLoggedIn ? (
        <Form {...form}>
        <form
         onSubmit={form.handleSubmit(handleSave)}
        >
    {editedFields?.map((fieldData: (typeof field.fields)[number], i: number) => {
      const fieldName = `${field.id}-${fieldData.name}`;

      return (
        <FormField
          key={i}
          control={form.control}
          name={fieldName}
          render={({ field }) => {
            switch (fieldData.type) {
              case "select":
                return (
                  <FormItem>
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleChangeSelect(
                          i as number,
                          {
                            target: { value } as HTMLSelectElement,
                          } as React.ChangeEvent<HTMLSelectElement>
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {"options" in fieldData &&
                          fieldData.options?.map((opt, j) => (
                            <SelectItem key={j} value={String(opt.code)}>
                              {opt.label.ja}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              case "checkbox":
                return (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        //checked={"value" in fieldData ? (fieldData.value as boolean) : false}
                        id={fieldName}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChangeCheckbox(
                            i as number,
                            {
                              target: { checked } as HTMLInputElement
                            } as React.ChangeEvent<HTMLInputElement>
                          );
                        }}
                        name={fieldName}
                        checked={field.value as boolean}
                        defaultChecked={fieldData.type === "checkbox" && "checked" in fieldData ? fieldData.checked : false}
                        disabled={"disabled" in fieldData ? fieldData.disabled : false}
                      />
                    </FormControl>
                    <FormLabel htmlFor={fieldName}>{fieldData.label}</FormLabel>
                    <FormMessage />
                  </FormItem>
                );
              case "switch":
                setSwitchLabel(
                  typeof fieldData.label === "object" && fieldData.label !== null
                    ? (field.value as boolean ? fieldData.label.on : fieldData.label.off)
                    : ""
                );
                return (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        id={fieldName}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChangeCheckbox(
                            i as number,
                            {
                              target: { checked } as HTMLInputElement
                            } as React.ChangeEvent<HTMLInputElement>
                          );
                        }}
                        name={fieldName}
                        checked={!!field.value as boolean}
                      />
                    </FormControl>
                    <FormLabel htmlFor={fieldName}>{switchLabel}</FormLabel>
                    <FormMessage />
                  </FormItem>
                );
              case "date":
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="date"
                        value={"value" in fieldData ? (fieldData.value as string) : ""}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeText(i as number, e);
                        }}
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              case "textarea":
                return (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        value={"value" in fieldData ? (fieldData.value as string) : ""}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeTextarea(i as number, e);
                        }}
                        className="w-[400px] h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              default:
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        value={"value" in fieldData ? (fieldData.value as string) : ""}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeText(i as number, e);
                        }}
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
            }
          }}
        />
      );
    })}

          {/* editedFields?.map(
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
          )*/}
          <Button type="submit" variant="primary" size="sm" disabled={submitDisabled}>
            保存
          </Button>
          {!props.defaultEditMode && (
            <Button type="button" variant="cancel" size="sm" onClick={cancelEdit}>
              取消
            </Button>
          )}
        </form>
        </Form>
      ) 
      : userLoggedIn ? (
        // Button to start editing
        <>
          {props.children}
          <Button variant="icon" onClick={startEditing}><SquarePen /></Button>
        </>
      )
      : null}
    </>
  );
};

export default EditableFields;
