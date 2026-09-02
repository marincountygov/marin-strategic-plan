"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { ZodObject, ZodRawShape } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/content/StatusBadge";
import { EntityForm } from "./EntityForm";
import { humanizeKey } from "@/lib/content/humanize";
import {
  clearDraft,
  loadDraft,
  saveDraft,
  subscribeDraftChanges,
} from "@/lib/admin/draft-storage";
import {
  fieldsForSchema,
  REFERENCE_FIELDS,
  slugify,
} from "@/lib/admin/schema-introspection";
import { defaultValueFor } from "./FieldControl";
import { id as buildId, slugFromId } from "@/lib/content/context";
import { SCHEMA_BY_TYPE, type BaseEntity } from "@/lib/content/schema";
import type { CollectionMetaData } from "@/app/admin/collection-meta";
import type { ReferenceOption } from "./ReferencePicker";

function typeOf(node: BaseEntity): string {
  return Array.isArray(node["@type"]) ? node["@type"][0] : node["@type"];
}

function buildSkeleton(type: string): BaseEntity {
  const schema = SCHEMA_BY_TYPE[type];
  const fields = fieldsForSchema(schema as ZodObject<ZodRawShape>);
  const base: Record<string, unknown> = {
    "@id": buildId("draft", "unsaved"),
    "@type": type,
    name: "",
    description: "",
  };
  for (const field of fields) {
    if (!(field.key in base)) base[field.key] = defaultValueFor(field.kind);
  }
  return base as BaseEntity;
}

export function CollectionEditor({
  meta,
  publishedNodes,
  otherPublishedNodes,
}: {
  meta: CollectionMetaData;
  publishedNodes: BaseEntity[];
  otherPublishedNodes: BaseEntity[];
}) {
  const draft = useSyncExternalStore(
    subscribeDraftChanges,
    () => loadDraft(meta.file),
    () => null,
  );
  const nodes = draft ?? publishedNodes;
  const isDraft = draft !== null;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingType, setCreatingType] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<string>(meta.types[0]);

  const referenceOptions: ReferenceOption[] = useMemo(() => {
    const all = [...otherPublishedNodes, ...nodes];
    return all
      .map((node) => ({ id: node["@id"], label: `${node.name} — ${humanizeKey(typeOf(node))}` }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [otherPublishedNodes, nodes]);

  const editingNode = editingId ? nodes.find((n) => n["@id"] === editingId) : undefined;

  function commit(next: BaseEntity[]) {
    saveDraft(meta.file, next);
  }

  function handleSave(entry: BaseEntity, wasNew: boolean) {
    let finalEntry = entry;
    if (wasNew) {
      finalEntry = { ...entry, "@id": buildId(meta.slug, slugify(entry.name) || "untitled") };
    }
    const exists = nodes.some((n) => n["@id"] === finalEntry["@id"]);
    const next = exists
      ? nodes.map((n) => (n["@id"] === finalEntry["@id"] ? finalEntry : n))
      : [...nodes, finalEntry];
    commit(next);
    setEditingId(null);
    setCreatingType(null);
  }

  function handleDelete(nodeId: string) {
    commit(nodes.filter((n) => n["@id"] !== nodeId));
  }

  function handleExport() {
    const payload = {
      "@context": {
        "@vocab": "https://schema.org/",
        marin: "https://marincountygov.github.io/marin-strategic-plan/vocab/",
      },
      "@graph": nodes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = meta.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const danglingReferences = useMemo(() => {
    const validIds = new Set([...otherPublishedNodes, ...nodes].map((n) => n["@id"]));
    const problems: string[] = [];
    for (const node of nodes) {
      for (const field of REFERENCE_FIELDS) {
        const value = (node as Record<string, unknown>)[field];
        if (!value) continue;
        const refs = Array.isArray(value) ? value : [value];
        for (const ref of refs) {
          if (typeof ref === "string" && !validIds.has(ref)) {
            problems.push(`${node.name}: ${humanizeKey(field)} → ${ref}`);
          }
        }
      }
    }
    return problems;
  }, [nodes, otherPublishedNodes]);

  // Singleton collections (plan.json, governance.json) are always exactly
  // one node, always in edit mode — no list, no add/delete.
  if (meta.singleton) {
    const node = nodes[0];
    if (!node) {
      return (
        <p className="font-product-body text-sm text-marin-red-700 dark:text-marin-red-300">
          {meta.file} has no node to edit — this shouldn&apos;t happen for a singleton collection.
        </p>
      );
    }
    return (
      <div>
        <DraftBanner isDraft={isDraft} onDiscard={() => clearDraft(meta.file)} onExport={handleExport} />
        <div className="mt-6 max-w-2xl">
          <EntityForm
            schema={SCHEMA_BY_TYPE[typeOf(node)]}
            initialValue={node}
            referenceOptions={referenceOptions}
            onSave={(entry) => handleSave(entry, false)}
            onCancel={() => setEditingId(null)}
          />
        </div>
      </div>
    );
  }

  if (creatingType || editingId) {
    const wasNew = creatingType !== null;
    const type = wasNew ? creatingType! : typeOf(editingNode!);
    const initialValue = wasNew ? buildSkeleton(type) : editingNode!;
    return (
      <div>
        <h2 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
          {wasNew ? `New ${humanizeKey(type)}` : `Edit ${initialValue.name}`}
        </h2>
        <div className="mt-4 max-w-2xl">
          <EntityForm
            schema={SCHEMA_BY_TYPE[type]}
            initialValue={initialValue}
            referenceOptions={referenceOptions}
            onSave={(entry) => handleSave(entry, wasNew)}
            onCancel={() => {
              setEditingId(null);
              setCreatingType(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DraftBanner isDraft={isDraft} onDiscard={() => clearDraft(meta.file)} onExport={handleExport} />

      {danglingReferences.length > 0 && (
        <div
          role="alert"
          className="mt-4 rounded-md bg-marin-red-50 p-3 font-product-body text-sm text-marin-red-700 dark:bg-marin-red-950 dark:text-marin-red-300"
        >
          <p className="font-semibold">Dangling references — fix before exporting:</p>
          <ul className="mt-1 list-disc pl-5">
            {danglingReferences.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {meta.types.length > 1 ? (
          <div className="flex items-center gap-2">
            <Select value={pendingType} onValueChange={setPendingType}>
              <SelectTrigger className="w-48" aria-label="New item type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meta.types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {humanizeKey(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => setCreatingType(pendingType)}>
              <Plus aria-hidden="true" />
              New {humanizeKey(pendingType)}
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setCreatingType(meta.types[0])}>
            <Plus aria-hidden="true" />
            New {meta.title}
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {nodes.map((node) => (
          <Card key={node["@id"]}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                {node["marin:status"] && <StatusBadge status={node["marin:status"]} />}
                <Badge variant="secondary">{humanizeKey(typeOf(node))}</Badge>
                <span className="font-product-mono text-xs text-marin-dark-gray dark:text-stone-400">
                  {slugFromId(node["@id"])}
                </span>
              </div>
              <CardTitle className="font-product-display text-base">{node.name}</CardTitle>
              <CardDescription>{node.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(node["@id"])}>
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(node["@id"])}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
        {nodes.length === 0 && (
          <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
            No items yet — add the first one above.
          </p>
        )}
      </div>
    </div>
  );
}

function DraftBanner({
  isDraft,
  onDiscard,
  onExport,
}: {
  isDraft: boolean;
  onDiscard: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-marin-gold-50 p-3 dark:bg-marin-gold-950">
      <p className="font-product-body text-sm text-marin-gold-900 dark:text-marin-gold-200">
        {isDraft
          ? "Editing a local draft — nothing here is saved to the repo until you export and commit it."
          : "Showing the published data. Edits create a local draft in this browser."}
      </p>
      <div className="flex gap-2">
        {isDraft && (
          <Button type="button" size="sm" variant="outline" onClick={onDiscard}>
            Discard draft
          </Button>
        )}
        <Button type="button" size="sm" onClick={onExport}>
          Download updated JSON
        </Button>
      </div>
    </div>
  );
}
