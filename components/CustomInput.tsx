import React from "react";
import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormField, FormLabel, FormMessage} from "./ui/form";
import {Input} from "./ui/input";

type CustomInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder: string;
};

export function CustomInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: CustomInputProps<TFieldValues, TName>) {
  const {control, name, label, placeholder} = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
}
