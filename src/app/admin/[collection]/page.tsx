import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentByFile } from "@/lib/content/graph";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { COLLECTIONS, getCollectionMeta, toCollectionMetaData } from "../collection-meta";

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const meta = getCollectionMeta(collection);
  return { title: meta ? `Admin — ${meta.title}` : "Admin" };
}

export default async function AdminCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const meta = getCollectionMeta(collection);
  if (!meta) notFound();

  const files = getContentByFile();
  const thisFile = files.find((entry) => entry.file === meta.file);
  const otherPublishedNodes = files
    .filter((entry) => entry.file !== meta.file)
    .flatMap((entry) => entry.nodes);

  return (
    <div>
      <h1 className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
        {meta.title}
      </h1>
      <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
        {meta.description}
      </p>
      <CollectionEditor
        meta={toCollectionMetaData(meta)}
        publishedNodes={thisFile?.nodes ?? []}
        otherPublishedNodes={otherPublishedNodes}
      />
    </div>
  );
}
