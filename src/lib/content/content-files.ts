/**
 * The list of src/data/*.json filenames — split out from graph.ts on
 * purpose: graph.ts imports node:fs to read them, and anything that
 * imports graph.ts pulls that in too. This file has no such import, so
 * client-side code that only needs the filenames (e.g. the admin sidebar)
 * can use it without dragging node:fs into the browser bundle.
 */
export const CONTENT_FILES = [
  "plan.json",
  "themes.json",
  "goals.json",
  "objectives.json",
  "strategies.json",
  "initiatives.json",
  "projects.json",
  "milestones.json",
  "deliverables.json",
  "outcomes.json",
  "kpis.json",
  "timeline-phases.json",
  "research.json",
  "engagement.json",
  "participants.json",
  "communications.json",
  "resources.json",
  "updates.json",
  "reports.json",
  "governance.json",
] as const;
