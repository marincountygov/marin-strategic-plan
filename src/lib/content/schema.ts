import { z } from "zod";

/**
 * Zod schemas for the strategic-plan content graph. These are the single
 * source of truth for both runtime validation (scripts/check-content.mjs)
 * and the TypeScript types every page/component imports. See
 * src/data/VOCABULARY.md for how each field maps to Schema.org / marin:.
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

export const PRIORITY_VALUES = ["Critical", "High", "Medium", "Low"] as const;
export const PrioritySchema = z.enum(PRIORITY_VALUES);
export type Priority = z.infer<typeof PrioritySchema>;

/** An @id reference to another node in the graph. */
const RefSchema = z.string().url();

/** Shared properties every major planning object supports. */
export const BaseEntitySchema = z.object({
  "@id": RefSchema,
  "@type": z.union([z.string(), z.array(z.string())]),
  name: z.string(),
  description: z.string(),
  text: z.string().optional(),
  "marin:status": StatusSchema.optional(),
  "marin:owner": RefSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  "marin:priority": PrioritySchema.optional(),
  "marin:progress": z.number().min(0).max(100).optional(),
  keywords: z.array(z.string()).optional(),
  "marin:relatedItems": z.array(RefSchema).optional(),
  dateModified: z.string().optional(),
  isPartOf: z.union([RefSchema, z.array(RefSchema)]).optional(),
  hasPart: z.array(RefSchema).optional(),
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
  "marin:featuredGoals": z.array(RefSchema).optional(),
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
  // Manually-reported engagement stats (the "Impact" card). Stats derivable
  // from our own data (e.g. events held) are computed on the homepage
  // instead of duplicated here — this holds only what has to come from
  // Engage's API or a manual count.
  "marin:impactStats": z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  // The "Make your voice heard" time-tiered calls to action. The
  // "attend-event" action's url is intentionally omitted here — the
  // homepage fills it in with whatever engagement.json event is soonest.
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

export const ThemeSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:StrategicTheme"),
});

export const GoalSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Goal"),
});

export const ObjectiveSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Objective"),
  "marin:baseline": z.string().optional(),
  "marin:target": z.string().optional(),
  "marin:dueDate": z.string().optional(),
  "marin:successMeasures": z.array(z.string()).optional(),
});

export const StrategySchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Strategy"),
});

export const InitiativeSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Initiative"),
  "marin:risks": z.array(z.string()).optional(),
  "marin:dependencies": z.array(z.string()).optional(),
});

export const ProjectSchema = BaseEntitySchema.extend({
  "@type": z.literal("Project"),
});

export const MilestoneSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Milestone"),
  "marin:dueDate": z.string(),
  "marin:percentComplete": z.number().min(0).max(100).optional(),
});

export const DeliverableSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Deliverable"),
});

export const OutcomeSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Outcome"),
});

export const ObservationSchema = z.object({
  "@type": z.literal("Observation"),
  observationDate: z.string(),
  value: z.number(),
});

export const KpiSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:KPI"),
  "marin:unit": z.string(),
  "marin:baseline": z.number(),
  "marin:target": z.number(),
  "marin:currentValue": z.number(),
  "marin:observations": z.array(ObservationSchema).optional(),
});

export const PhaseSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:PlanPhase"),
  "marin:percentComplete": z.number().min(0).max(100),
  order: z.number(),
});

// Research items always use Dataset as their @type — distinct from
// reports.json's Report and resources.json's CreativeWork — so a single
// type string maps to exactly one schema in SCHEMA_BY_TYPE below.
// marin:researchType carries the actual subtype (Survey, Existing Plan,
// Demographic Study, Community Finding, Data Source, ...).
export const ResearchItemSchema = BaseEntitySchema.extend({
  "@type": z.literal("Dataset"),
  "marin:researchType": z.string(),
  "marin:year": z.number(),
  url: z.string().url().optional(),
});

export const EngagementActivitySchema = BaseEntitySchema.extend({
  "@type": z.literal("Event"),
  location: z.string().optional(),
  "marin:audience": z.string().optional(),
  "marin:participationSummary": z.string().optional(),
  "marin:outcomes": z.string().optional(),
});

export const ParticipantSchema = BaseEntitySchema.extend({
  "@type": z.enum(["Person", "Organization", "GovernmentOrganization", "Audience"]),
  "marin:role": z.string(),
  url: z.string().url().optional(),
});

export const CommunicationChannelSchema = BaseEntitySchema.extend({
  "@type": z.enum(["Service", "WebSite", "ContactPoint"]),
  url: z.string().url(),
  "marin:account": z.string().optional(),
  "marin:purpose": z.array(z.string()),
  "marin:audience": z.string().optional(),
  "marin:primary": z.boolean().optional(),
});

export const ResourceSchema = BaseEntitySchema.extend({
  "@type": z.literal("CreativeWork"),
  url: z.string().url(),
  "marin:resourceType": z.string(),
});

export const UpdateSchema = BaseEntitySchema.extend({
  "@type": z.enum(["BlogPosting", "NewsArticle"]),
  datePublished: z.string(),
  "marin:category": z.enum([
    "News",
    "Progress Update",
    "Board Action",
    "Milestone Completion",
    "Upcoming Event",
  ]),
});

export const ReportSchema = BaseEntitySchema.extend({
  "@type": z.literal("Report"),
  "marin:reportType": z.enum(["Quarterly", "Annual", "Progress", "Dashboard"]),
  "marin:period": z.string(),
  url: z.string().url().optional(),
});

export const GovernanceSchema = BaseEntitySchema.extend({
  "@type": z.literal("marin:Governance"),
  "marin:executiveSponsor": RefSchema,
  "marin:steeringCommittee": z.array(RefSchema),
  "marin:planningTeam": z.array(RefSchema),
  "marin:decisionMakers": z.array(RefSchema),
  "marin:approvalMilestones": z.array(RefSchema),
});

/** Maps a JSON-LD @type string to its Zod schema, for check-content.mjs and graph.ts. */
export const SCHEMA_BY_TYPE: Record<string, z.ZodTypeAny> = {
  "marin:StrategicPlan": StrategicPlanSchema,
  "marin:StrategicTheme": ThemeSchema,
  "marin:Goal": GoalSchema,
  "marin:Objective": ObjectiveSchema,
  "marin:Strategy": StrategySchema,
  "marin:Initiative": InitiativeSchema,
  Project: ProjectSchema,
  "marin:Milestone": MilestoneSchema,
  "marin:Deliverable": DeliverableSchema,
  "marin:Outcome": OutcomeSchema,
  "marin:KPI": KpiSchema,
  "marin:PlanPhase": PhaseSchema,
  Report: ReportSchema,
  Dataset: ResearchItemSchema,
  Event: EngagementActivitySchema,
  Person: ParticipantSchema,
  Organization: ParticipantSchema,
  GovernmentOrganization: ParticipantSchema,
  Audience: ParticipantSchema,
  Service: CommunicationChannelSchema,
  WebSite: CommunicationChannelSchema,
  ContactPoint: CommunicationChannelSchema,
  CreativeWork: ResourceSchema,
  BlogPosting: UpdateSchema,
  NewsArticle: UpdateSchema,
  "marin:Governance": GovernanceSchema,
};
