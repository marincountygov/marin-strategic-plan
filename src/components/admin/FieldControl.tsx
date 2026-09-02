"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReferencePicker, type ReferenceOption } from "./ReferencePicker";
import { humanizeKey } from "@/lib/content/humanize";
import type { FieldKind, FieldMeta } from "@/lib/admin/schema-introspection";

/** A sensible empty value for a new row/field of this kind — used when
 *  adding an array item or expanding an optional nested object. */
export function defaultValueFor(kind: FieldKind): unknown {
  switch (kind.type) {
    case "string":
    case "url":
      return "";
    case "reference":
      return null;
    case "number":
      return 0;
    case "boolean":
      return false;
    case "enum":
      return kind.options[0];
    case "array":
      return [];
    case "object":
      return Object.fromEntries(kind.fields.map((field) => [field.key, defaultValueFor(field.kind)]));
    default:
      return null;
  }
}

/** Renders the control for one value of a given kind — recursively, for
 *  array items and nested object fields alike. This is the one place a Zod
 *  shape turns into an actual form control; EntityForm.tsx just walks the
 *  top-level fields and calls this. */
export function FieldControl({
  kind,
  value,
  onChange,
  referenceOptions,
  idPrefix,
  ariaLabel,
}: {
  kind: FieldKind;
  value: unknown;
  onChange: (next: unknown) => void;
  referenceOptions: ReferenceOption[];
  idPrefix: string;
  /** Falls back to this when there's no <label htmlFor> to rely on — every
   *  row inside an array is a sibling under one shared field label, so each
   *  row's own combobox needs its own accessible name (WCAG 4.1.2). */
  ariaLabel?: string;
}) {
  switch (kind.type) {
    case "string": {
      if (kind.multiline) {
        return (
          <Textarea
            id={idPrefix}
            value={(value as string) ?? ""}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
          />
        );
      }
      return (
        <Input
          id={idPrefix}
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    }

    case "url":
      return (
        <Input
          id={idPrefix}
          type="url"
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case "reference":
      return (
        <ReferencePicker
          value={(value as string) ?? null}
          onChange={onChange}
          options={referenceOptions}
          id={idPrefix}
          ariaLabel={ariaLabel}
        />
      );

    case "number":
      return (
        <Input
          id={idPrefix}
          type="number"
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(event) =>
            onChange(event.target.value === "" ? undefined : Number(event.target.value))
          }
        />
      );

    case "boolean":
      return (
        <Checkbox
          id={idPrefix}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
      );

    case "enum":
      return (
        <Select value={(value as string) ?? undefined} onValueChange={onChange}>
          <SelectTrigger id={idPrefix} aria-label={ariaLabel} className="w-full">
            <SelectValue placeholder="Choose…" />
          </SelectTrigger>
          <SelectContent>
            {kind.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "array": {
      const items = Array.isArray(value) ? value : [];
      const updateAt = (index: number, next: unknown) => {
        const copy = [...items];
        copy[index] = next;
        onChange(copy);
      };
      const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));
      const add = () => onChange([...items, defaultValueFor(kind.item)]);

      return (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <FieldControl
                  kind={kind.item}
                  value={item}
                  onChange={(next) => updateAt(index, next)}
                  referenceOptions={referenceOptions}
                  idPrefix={`${idPrefix}-${index}`}
                  ariaLabel={ariaLabel ? `${ariaLabel} item ${index + 1}` : undefined}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAt(index)}
                aria-label="Remove item"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus aria-hidden="true" />
            Add item
          </Button>
        </div>
      );
    }

    case "object": {
      const obj = (value as Record<string, unknown>) ?? {};
      return (
        <fieldset className="space-y-4 rounded-md border border-stone-200 p-3 dark:border-stone-800">
          {kind.fields.map((field) => (
            <FormField
              key={field.key}
              meta={field}
              value={obj[field.key]}
              onChange={(next) => onChange({ ...obj, [field.key]: next })}
              referenceOptions={referenceOptions}
              idPrefix={`${idPrefix}-${field.key}`}
            />
          ))}
        </fieldset>
      );
    }

    default:
      return (
        <p className="font-product-mono text-xs text-marin-dark-gray dark:text-stone-400">
          Unsupported field — edit this one directly in the exported JSON.
        </p>
      );
  }
}

/** A labeled field: FieldControl plus its <Label>, required marker, and
 *  error message. Used for every top-level field (EntityForm.tsx) and
 *  recurses into itself for nested object fields (the "object" case above). */
export function FormField({
  meta,
  value,
  onChange,
  referenceOptions,
  idPrefix,
  error,
}: {
  meta: FieldMeta;
  value: unknown;
  onChange: (next: unknown) => void;
  referenceOptions: ReferenceOption[];
  idPrefix: string;
  error?: string;
}) {
  const isCheckbox = meta.kind.type === "boolean";
  const errorId = error ? `${idPrefix}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <div className={isCheckbox ? "flex items-center gap-2" : undefined}>
        {isCheckbox && (
          <FieldControl
            kind={meta.kind}
            value={value}
            onChange={onChange}
            referenceOptions={referenceOptions}
            idPrefix={idPrefix}
            ariaLabel={humanizeKey(meta.key)}
          />
        )}
        <Label htmlFor={idPrefix}>
          {humanizeKey(meta.key)}
          {!meta.optional && <span className="text-marin-red-700 dark:text-marin-red-300"> *</span>}
        </Label>
      </div>
      {!isCheckbox && (
        <FieldControl
          kind={meta.kind}
          value={value}
          onChange={onChange}
          referenceOptions={referenceOptions}
          idPrefix={idPrefix}
          ariaLabel={humanizeKey(meta.key)}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="font-product-body text-sm text-marin-red-700 dark:text-marin-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
