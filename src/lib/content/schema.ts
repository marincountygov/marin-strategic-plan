import { z } from "zod";

/**
 * Zod schemas for the site's content. These are the single source of truth
 * for both runtime validation (scripts/check-content.ts) and the TypeScript
 * types every page/component imports. See src/data/VOCABULARY.md for how
 * each field maps to Schema.org / marin:.
 */

export const STATUS_VALUES = [
  "Not Started",
  "Planning",
  "In Progress",
  "On Track",
  "At Risk",
  "Blocked",
  "Completed",
  "Cancelled",
] as const;
export const StatusSchema = z.enum(STATUS_VALUES);
export type Status = z.infer<typeof StatusSchema>;

/** Shared properties every content node supports. */
export const BaseEntitySchema = z.object({
  "@id": z.string().url(),
  "@type": z.union([z.string(), z.array(z.string())]),
  name: z.string(),
  description: z.string(),
  text: z.string().optional(),
  "marin:status": StatusSchema.optional(),
  startDate: z.string().optional(),
  dateModified: z.string().optional(),
});
export type BaseEntity = z.infer<typeof BaseEntitySchema>;

export const StrategicPlanSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:StrategicPlan"),
  "marin:vision": z.string(),
  "marin:mission": z.string(),
  "marin:values": z.array(z.object({ name: z.string(), description: z.string() })),
  "marin:about": z.object({
    purpose: z.string(),
    whyItMatters: z.string(),
    scope: z.string(),
    planningApproach: z.string(),
    expectedOutcomes: z.string(),
  }),
  "marin:faq": z.array(z.object({ question: z.string(), answer: z.string() })),
  // The three homepage cards (Learn More / Get Involved / Impact) — content
  // for the simplified short-term homepage, kept as data rather than
  // hardcoded JSX so the copy can be swapped (e.g. for approved comms
  // language) without touching page code.
  "marin:homeCards": z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
        linkLabel: z.string(),
        linkHref: z.string(),
      }),
    )
    .length(3)
    .optional(),
  // The "Envision Marin so far" stats band — currently commented out on the
  // homepage (no engagement data source wired up yet); kept as an optional
  // field so it's a one-line uncomment once real numbers are ready.
  "marin:impactStats": z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  // The "Make your voice heard" time-tiered calls to action.
  "marin:voiceActions": z
    .array(
      z.object({
        id: z.enum(["share-one-idea", "share-multiple-ideas", "attend-event"]),
        timeCommitment: z.string(),
        label: z.string(),
        description: z.string(),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
});
export type StrategicPlanEntity = z.infer<typeof StrategicPlanSchema>;

export const CommunicationChannelSchema = BaseEntitySchema.extend({
  "@type": z.enum(["Service", "WebSite", "ContactPoint"]),
  url: z.string().url(),
  "marin:account": z.string().optional(),
  "marin:purpose": z.array(z.string()),
  "marin:audience": z.string().optional(),
  "marin:primary": z.boolean().optional(),
});
export type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;

/** Maps a JSON-LD @type string to its Zod schema, for check-content.ts and graph.ts. */
export const SCHEMA_BY_TYPE: Record<string, z.ZodTypeAny> = {
  "marin:StrategicPlan": StrategicPlanSchema,
  Service: CommunicationChannelSchema,
  WebSite: CommunicationChannelSchema,
  ContactPoint: CommunicationChannelSchema,
};
