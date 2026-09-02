"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

export interface ReferenceOption {
  id: string;
  label: string;
}

/**
 * A single @id picker over every node in the graph — used directly for
 * single-value reference fields (marin:owner) and per-row inside
 * ArrayField for multi-value ones (hasPart, marin:relatedItems, ...). A
 * plain <Select> rather than a search-as-you-type combobox: the graph is a
 * few dozen nodes today, well within what a native select handles fine.
 */
export function ReferencePicker({
  value,
  onChange,
  options,
  clearable = true,
  id,
  ariaLabel,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  options: ReferenceOption[];
  clearable?: boolean;
  id?: string;
  /** Falls back to this when there's no <label htmlFor> pointing at `id` —
   *  each row inside an array of references is a sibling under one shared
   *  field label, so each row's own combobox needs its own accessible name. */
  ariaLabel?: string;
}) {
  return (
    <Select
      value={value ?? NONE}
      onValueChange={(next) => onChange(next === NONE ? null : next)}
    >
      <SelectTrigger id={id} aria-label={ariaLabel} className="w-full">
        <SelectValue placeholder="Choose an item…" />
      </SelectTrigger>
      <SelectContent>
        {clearable && <SelectItem value={NONE}>— None —</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
