import type { FullAutoFill, HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

type BaseFormFieldConfig<Value, MappingFunction, IncludeInMapping, FilterFunction> = {
  id: string;
  autocomplete: FullAutoFill;
  type: HTMLInputTypeAttribute | 'textarea';
  name: string;
  label: string;
  invalidText: string;
  validate: (value: string) => boolean;
  required: boolean;

  initialValue?: Value;
  mappingFunction?: MappingFunction;
  includeInMapping?: IncludeInMapping;
  filterFunction?: FilterFunction;

  onblur?: (event: FocusEvent) => void;
  oninput?: (event: Event) => void;
};

type AdditionalElementAttributes<Value, MappingFunction, IncludeInMapping, FilterFunction> = Omit<
  HTMLInputAttributes,
  keyof BaseFormFieldConfig<Value, MappingFunction, IncludeInMapping, FilterFunction>
>;

export type FormFieldConfig<Value, MappingFunction, IncludeInMapping, FilterFunction> = BaseFormFieldConfig<
  Value,
  MappingFunction,
  IncludeInMapping,
  FilterFunction
> & {
  additionalElementAttributes?: AdditionalElementAttributes<Value, MappingFunction, IncludeInMapping, FilterFunction>;
};

export class FormField<
  Value = string,
  MappingFunction extends (value: Value) => unknown = (value: Value) => Value,
  IncludeInMapping extends boolean = true,
  FilterFunction extends ((value: Value) => boolean) | null = null,
> implements Omit<Required<FormFieldConfig<Value, MappingFunction, IncludeInMapping, FilterFunction>>, 'initialValue'>
{
  value = $state() as Value;
  isValid = $state(true);

  declare readonly id: string;
  declare readonly autocomplete: FullAutoFill;
  declare readonly type: HTMLInputTypeAttribute | 'textarea';
  declare readonly name: string;
  declare readonly label: string;
  declare readonly invalidText: string;
  declare readonly validate: (value: string) => boolean;
  declare readonly required: boolean;

  readonly includeInMapping: IncludeInMapping = true as IncludeInMapping;
  readonly mappingFunction: MappingFunction = ((value) => value) as MappingFunction;
  readonly filterFunction: FilterFunction = null as FilterFunction;

  onblur: (event: FocusEvent) => void = generateFormFieldOnblurCallback(this);
  oninput: (event: Event) => void = generateFormFieldOninputCallback(this);

  additionalElementAttributes: AdditionalElementAttributes<Value, MappingFunction, IncludeInMapping, FilterFunction> =
    {};

  constructor({
    initialValue = '' as Value,
    ...config
  }: FormFieldConfig<Value, MappingFunction, IncludeInMapping, FilterFunction>) {
    this.value = initialValue;
    Object.assign(this, config);
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type GenericFormField = FormField<any, (value: any) => any, boolean, ((value: any) => boolean) | null>;

type FormFields = Record<string, GenericFormField>;

export const validateFormFields = (formFields: FormFields): boolean => {
  return Object.values(formFields).every((field) => {
    field.isValid = field.validate(field.value);
    if (!field.isValid) {
      document.getElementById(field.id)?.focus();
    }
    return field.isValid;
  });
};

export const generateFormFieldOnblurCallback = (formField: GenericFormField) => {
  return (): void => {
    formField.isValid = formField.validate(formField.value);
  };
};

export const generateFormFieldOninputCallback = (formField: GenericFormField) => {
  return (): void => {
    const isValid = formField.validate(formField.value);
    if (isValid) formField.isValid = isValid;
  };
};

type FormFieldValues<Fields extends FormFields> = {
  [K in keyof Fields as Fields[K]['includeInMapping'] extends true
    ? K
    : never]: Fields[K]['filterFunction'] extends null
    ? ReturnType<Fields[K]['mappingFunction']>
    : ReturnType<Fields[K]['mappingFunction']> | undefined;
};

export const mapFormFieldsToValues = <Fields extends FormFields>(formFields: Fields): FormFieldValues<Fields> => {
  return Object.fromEntries(
    Object.entries(formFields)
      .filter(([, field]) => field.includeInMapping && (field.filterFunction?.(field.value) ?? true))
      .map(([key, field]) => [key, field.mappingFunction(field.value)]),
  ) as FormFieldValues<Fields>;
};

export const populateFormFields = (
  formFields: FormFields,
  data: Record<string, string>,
  rewriteWhenDataFieldIsEmpty = true,
): void => {
  Object.entries(data).forEach(([key, value]) => {
    if (formFields[key]) {
      if (!rewriteWhenDataFieldIsEmpty && !value) return;
      formFields[key].value = value;
    }
  });
};
