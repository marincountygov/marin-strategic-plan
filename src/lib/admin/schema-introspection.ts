import { z } from "zod";

/**
 * Classifies a Zod field into the control the generic admin form should
 * render for it — the whole point being that adding a field to
 * src/lib/content/schema.ts is enough; nothing here needs updating unless
 * the field is genuinely a new *kind* of thing (see REFERENCE_FIELDS below).
 */
export type FieldKind =
  | { type: "string"; multiline: boolean }
  | { type: "url" }
  | { type: "reference" }
  | { type: "number" }
  | { type: "boolean" }
  | { type: "enum"; options: string[] }
  | { type: "array"; item: FieldKind }
  | { type: "object"; fields: FieldMeta[] }
  | { type: "unsupported" };

export interface FieldMeta {
  key: string;
  optional: boolean;
  kind: FieldKind;
}

/**
 * Both a plain external link (resources.json's "url") and a reference to
 * another node (isPartOf, hasPart, ...) are z.string().url() at the Zod
 * type level — nothing to introspect there. This short, documented list is
 * what tells the form which is which. Keep it in sync with
 * src/data/VOCABULARY.md's relationship fields if a new one is added.
 */
export const REFERENCE_FIELDS = new Set([
  "isPartOf",
  "hasPart",
  "marin:owner",
  "marin:relatedItems",
  "marin:executiveSponsor",
  "marin:steeringCommittee",
  "marin:planningTeam",
  "marin:decisionMakers",
  "marin:approvalMilestones",
  "marin:featuredGoals",
]);

const LONG_TEXT_FIELDS = new Set([
  "description",
  "text",
  "body",
  "answer",
  "question",
  "purpose",
  "whyItMatters",
  "scope",
  "planningApproach",
  "expectedOutcomes",
  "marin:outcomes",
]);

/** Fields the generic form never renders — shown specially at the top of
 *  the form instead (see EntityForm.tsx). */
export const STRUCTURAL_FIELDS = new Set(["@id", "@type"]);

function unwrap(schema: z.ZodTypeAny): { inner: z.ZodTypeAny; optional: boolean } {
  let optional = false;
  let current = schema;
  // ZodOptional, ZodDefault, and ZodNullable all wrap an inner type the
  // same way — peel them all off to get to the real shape.
  while (true) {
    if (current instanceof z.ZodOptional) {
      optional = true;
      current = current.unwrap();
    } else if (current instanceof z.ZodDefault) {
      optional = true;
      current = current._def.innerType;
    } else if (current instanceof z.ZodNullable) {
      optional = true;
      current = current.unwrap();
    } else {
      break;
    }
  }
  return { inner: current, optional };
}

function isUrlString(schema: z.ZodTypeAny): boolean {
  if (!(schema instanceof z.ZodString)) return false;
  const checks = (schema._def as { checks?: { kind: string }[] }).checks ?? [];
  return checks.some((check) => check.kind === "url");
}

function classifyType(schema: z.ZodTypeAny, key: string): FieldKind {
  if (schema instanceof z.ZodString) {
    if (isUrlString(schema)) {
      return REFERENCE_FIELDS.has(key) ? { type: "reference" } : { type: "url" };
    }
    return { type: "string", multiline: LONG_TEXT_FIELDS.has(key) };
  }
  if (schema instanceof z.ZodNumber) return { type: "number" };
  if (schema instanceof z.ZodBoolean) return { type: "boolean" };
  if (schema instanceof z.ZodEnum) return { type: "enum", options: [...schema.options] };
  if (schema instanceof z.ZodArray) {
    return { type: "array", item: classifyType(unwrap(schema.element).inner, key) };
  }
  if (schema instanceof z.ZodObject) {
    return { type: "object", fields: fieldsFromShape(schema.shape) };
  }
  if (schema instanceof z.ZodUnion) {
    // isPartOf: RefSchema | RefSchema[] — treat as the array case, since a
    // single ref is just a one-item array in the form and gets collapsed
    // back down on save (see EntityForm.tsx).
    const options = schema._def.options as z.ZodTypeAny[];
    const arrayOption = options.find((option) => option instanceof z.ZodArray);
    if (arrayOption) return classifyType(arrayOption, key);
    return classifyType(options[0], key);
  }
  return { type: "unsupported" };
}

/** Every field on a Zod object, excluding @id/@type (STRUCTURAL_FIELDS —
 *  the form handles those separately) and literal-typed fields (fixed by
 *  the schema, nothing for a human to choose). */
export function fieldsFromShape(shape: Record<string, z.ZodTypeAny>): FieldMeta[] {
  return Object.entries(shape)
    .filter(([key, value]) => {
      if (STRUCTURAL_FIELDS.has(key)) return false;
      const { inner } = unwrap(value);
      return !(inner instanceof z.ZodLiteral);
    })
    .map(([key, value]) => {
      const { inner, optional } = unwrap(value);
      return { key, optional, kind: classifyType(inner, key) };
    });
}

export function fieldsForSchema(schema: z.ZodObject<z.ZodRawShape>): FieldMeta[] {
  return fieldsFromShape(schema.shape);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
