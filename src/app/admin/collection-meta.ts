import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Compass,
  Crosshair,
  Download,
  FileBarChart,
  Flag,
  FolderKanban,
  Landmark,
  MessageSquare,
  Microscope,
  Newspaper,
  Package,
  Rocket,
  Route,
  Layers,
  Target,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CONTENT_FILES } from "@/lib/content/content-files";
import { SECTION_LABELS } from "@/app/json/section-labels";

export interface CollectionMeta {
  file: (typeof CONTENT_FILES)[number];
  /** URL segment under /admin — the filename without ".json". */
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** The @type value(s) valid for nodes in this file. */
  types: string[];
  /** Exactly one node, always — no add/delete, just an edit form. */
  singleton: boolean;
}

const ICONS: Record<(typeof CONTENT_FILES)[number], LucideIcon> = {
  "plan.json": Compass,
  "themes.json": Layers,
  "goals.json": Target,
  "objectives.json": Crosshair,
  "strategies.json": Route,
  "initiatives.json": Rocket,
  "projects.json": FolderKanban,
  "milestones.json": Flag,
  "deliverables.json": Package,
  "outcomes.json": CheckCircle2,
  "kpis.json": BarChart3,
  "timeline-phases.json": CalendarClock,
  "research.json": Microscope,
  "engagement.json": Users,
  "participants.json": UserRound,
  "communications.json": MessageSquare,
  "resources.json": Download,
  "updates.json": Newspaper,
  "reports.json": FileBarChart,
  "governance.json": Landmark,
};

const TYPES: Record<(typeof CONTENT_FILES)[number], string[]> = {
  "plan.json": ["marin:StrategicPlan"],
  "themes.json": ["marin:StrategicTheme"],
  "goals.json": ["marin:Goal"],
  "objectives.json": ["marin:Objective"],
  "strategies.json": ["marin:Strategy"],
  "initiatives.json": ["marin:Initiative"],
  "projects.json": ["Project"],
  "milestones.json": ["marin:Milestone"],
  "deliverables.json": ["marin:Deliverable"],
  "outcomes.json": ["marin:Outcome"],
  "kpis.json": ["marin:KPI"],
  "timeline-phases.json": ["marin:PlanPhase"],
  "research.json": ["Dataset"],
  "engagement.json": ["Event"],
  "participants.json": ["Person", "Organization", "GovernmentOrganization", "Audience"],
  "communications.json": ["Service", "WebSite", "ContactPoint"],
  "resources.json": ["CreativeWork"],
  "updates.json": ["BlogPosting", "NewsArticle"],
  "reports.json": ["Report"],
  "governance.json": ["marin:Governance"],
};

const SINGLETONS = new Set<(typeof CONTENT_FILES)[number]>(["plan.json", "governance.json"]);

export const COLLECTIONS: CollectionMeta[] = CONTENT_FILES.map((file) => ({
  file,
  slug: file.replace(/\.json$/, ""),
  title: SECTION_LABELS[file].title,
  description: SECTION_LABELS[file].description,
  icon: ICONS[file],
  types: TYPES[file],
  singleton: SINGLETONS.has(file),
}));

export function getCollectionMeta(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}

/** CollectionMeta minus `icon` — a React component reference isn't
 *  serializable across the server/client boundary, so this is the shape
 *  actually passed as a prop into the client-side CollectionEditor. */
export type CollectionMetaData = Omit<CollectionMeta, "icon">;

export function toCollectionMetaData({ icon: _icon, ...rest }: CollectionMeta): CollectionMetaData {
  return rest;
}
