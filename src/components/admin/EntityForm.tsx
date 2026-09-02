"use client";

import { useState, type FormEvent } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "./FieldControl";
import { fieldsForSchema } from "@/lib/admin/schema-introspection";
import type { ReferenceOption } from "./ReferencePicker";
import type { BaseEntity } from "@/lib/content/schema";

/**
 * The form for one entity — walks its Zod schema's top-level fields
 * (fieldsForSchema) and renders a FormField per field. @id and @type ride
 * along in state untouched (fieldsForSchema excludes them from what's
 * rendered; see STRUCTURAL_FIELDS in schema-introspection.ts) since the
 * form never lets either be edited directly.
 */
export function EntityForm({
  schema,
  initialValue,
  referenceOptions,
  onSave,
  onCancel,
}: {
  schema: z.ZodTypeAny;
  initialValue: BaseEntity;
  referenceOptions: ReferenceOption[];
  onSave: (value: BaseEntity) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState<Record<string, unknown>>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields = fieldsForSchema(schema as z.ZodObject<z.ZodRawShape>);

  function updateField(key: string, next: unknown) {
    setValue((prev) => ({ ...prev, [key]: next }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = schema.safeParse(value);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSave(result.data as BaseEntity);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <p role="alert" className="font-product-body text-sm text-marin-red-700 dark:text-marin-red-300">
          {errors.form}
        </p>
      )}
      {fields.map((field) => (
        <FormField
          key={field.key}
          meta={field}
          value={value[field.key]}
          onChange={(next) => updateField(field.key, next)}
          referenceOptions={referenceOptions}
          idPrefix={`field-${field.key}`}
          error={errors[field.key]}
        />
      ))}
      <div className="flex gap-2 border-t border-stone-200 pt-4 dark:border-stone-800">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
