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
import ImageUploader from "@/components/Form/ImageUploader";

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
          label?: string | {on: string, off: string};
        }

        | {
          name: string;
          type: "select";
          value: string | number | boolean;
          option: {
            code: string | number | readonly string[] | undefined;
            label: Record<string, string>;
          }[];
          label?: string;
        }
        | {
          name: string;
          type: "image";
          value: string;
          collectionName: string;
          imageOptions: {
            width?: number;
            height?: number;
            aspectKeep: boolean;
            maxDataSize: number; 
          };
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
    targetField &&
    "limit" in targetField &&
    typeof targetField.limit !== "undefined"
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

  const inputElements = useRef(new Array(field.fields.length));
  const selectElements = useRef(new Array(field.fields.length));

  const startEditing = () => {
    setSubmitDisabled(!props.defaultEditMode);
    props.editing && props.editing();
    setIsEditing(true);
    setEditedFields(JSON.parse(JSON.stringify(field.fields)));
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
      ) : isEditing && props.userLoggedIn ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="flex w-full flex-wrap justify-start items-center gap-4"
          >
            {editedFields?.map(
              (fieldData: (typeof field.fields)[number], i: number) => {
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
                                value={
                                  fieldData.value ? String(fieldData.value) : undefined
                                }
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
                                <SelectContent className="bg-background">
                                  {"option" in fieldData &&
                                    fieldData.option?.map((opt, j) => (
                                      <SelectItem
                                        key={j}
                                        value={String(opt.code)}
                                      >
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
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  id={fieldName}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    handleChangeCheckbox(
                                      i as number,
                                      {
                                        target: { checked } as HTMLInputElement,
                                      } as React.ChangeEvent<HTMLInputElement>
                                    );
                                  }}
                                  name={fieldName}
                                  checked={"value" in fieldData ? (fieldData.value as boolean) : false}
                                  disabled={
                                    "disabled" in fieldData
                                      ? fieldData.disabled
                                      : false
                                  }
                                />
                              </FormControl>
                              <FormLabel htmlFor={fieldName}>
                                {fieldData.label}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          );
                        case "switch":
                          const label =
                            typeof fieldData.label === "object" &&
                            fieldData.label !== null
                              ? ("checked" in fieldData) && fieldData.checked
                                ? fieldData.label.on
                                : fieldData.label.off
                              : "";
                          return (
                            <FormItem className="flex items-center space-x-2 min-w-[86px]">
                              <FormControl>
                                <Switch
                                  id={fieldName}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    handleChangeCheckbox(
                                      i as number,
                                      {
                                        target: { checked } as HTMLInputElement,
                                      } as React.ChangeEvent<HTMLInputElement>
                                    );
                                  }}
                                  name={fieldName}
                                  checked={("checked" in fieldData) && fieldData.checked}
                                  disabled={fieldData.disabled}
                                />
                              </FormControl>
                              <FormLabel htmlFor={fieldName}>{label}</FormLabel>
                              <FormMessage />
                            </FormItem>
                          );
                        case "date":
                          return (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="date"
                                  value={
                                    "value" in fieldData
                                      ? (fieldData.value as string)
                                      : ""
                                  }
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
                                  value={
                                    "value" in fieldData
                                      ? (fieldData.value as string)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleChangeTextarea(i as number, e);
                                  }}
                                  className="w-[calc(100vw-2rem)] h-[150px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                          /*
                        case "image":
                          if (
                            "collectionName" in fieldData &&
                            "imageOptions" in fieldData
                          ) {
                            return (
                              <ImageUploader
                                collectionName={fieldData.collectionName}
                                options={{
                                  ...fieldData.imageOptions,
                                  height: fieldData.imageOptions.height ?? 0,
                                  width: fieldData.imageOptions.width ?? 0,
                                }}
                              />
                            );
                          }
                          return null;
                          */
                        default:
                          return (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="text"
                                  value={
                                    "value" in fieldData
                                      ? (fieldData.value as string)
                                      : ""
                                  }
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
              }
            )}
            <footer className="flex items-center gap-2 w-full justify-end md:w-auto!">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitDisabled}
              >
                保存
              </Button>
              {!props.defaultEditMode && (
                <Button
                  type="button"
                  variant="cancel"
                  size="sm"
                  onClick={cancelEdit}
                >
                  取消
                </Button>
              )}
            </footer>
          </form>
        </Form>
      ) : userLoggedIn ? (
        <>
          {props.children}
          <Button variant="icon" onClick={startEditing}>
            <SquarePen />
          </Button>
        </>
      ) : null}
    </>
  );
};

export default EditableFields;
