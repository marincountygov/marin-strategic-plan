/** Plain-language name + one-line explanation for each src/data/*.json
 *  file, for the /json page's headings — the technical filename is kept as
 *  a small secondary label, not the heading itself, so the page reads for
 *  an executive skimming it as well as an engineer drilling into it. */
export const SECTION_LABELS: Record<string, { title: string; description: string }> = {
  "plan.json": {
    title: "The Plan",
    description: "The plan itself — vision, mission, values, and what it's trying to do.",
  },
  "themes.json": {
    title: "Strategic Themes",
    description: "The handful of high-level priorities the plan is organized around.",
  },
  "goals.json": {
    title: "Goals",
    description: "What the plan is trying to achieve under each theme.",
  },
  "objectives.json": {
    title: "Objectives",
    description: "Measurable targets that make a goal concrete — a baseline, a target, a due date.",
  },
  "strategies.json": {
    title: "Strategies",
    description: "The approach chosen to reach an objective.",
  },
  "initiatives.json": {
    title: "Initiatives",
    description: "The active work implementing a strategy.",
  },
  "projects.json": {
    title: "Projects",
    description: "Specific projects carrying out an initiative.",
  },
  "milestones.json": {
    title: "Milestones",
    description: "Key checkpoints within a project, each with a due date.",
  },
  "deliverables.json": {
    title: "Deliverables",
    description: "Concrete outputs produced along the way to a milestone.",
  },
  "outcomes.json": {
    title: "Outcomes",
    description: "The real-world result a deliverable was meant to produce.",
  },
  "kpis.json": {
    title: "Key Performance Indicators (KPIs)",
    description: "The numbers tracked to know whether a goal is on target.",
  },
  "timeline-phases.json": {
    title: "Timeline Phases",
    description: "The stages the plan moves through, from initial research to ongoing reporting.",
  },
  "research.json": {
    title: "Research",
    description: "Studies, surveys, and existing plans the work is built on.",
  },
  "engagement.json": {
    title: "Community Engagement",
    description: "Workshops, meetings, and events where people weighed in.",
  },
  "participants.json": {
    title: "Participants",
    description: "The people and organizations involved in the plan.",
  },
  "communications.json": {
    title: "Communication Channels",
    description: "Where updates and ways to participate are shared.",
  },
  "resources.json": {
    title: "Resources",
    description: "Downloads, presentations, and related materials.",
  },
  "updates.json": {
    title: "News & Updates",
    description: "Announcements, progress updates, and board actions.",
  },
  "reports.json": {
    title: "Reports",
    description: "Quarterly and annual progress reports.",
  },
  "governance.json": {
    title: "Governance",
    description: "Who's responsible for decisions and oversight.",
  },
};
