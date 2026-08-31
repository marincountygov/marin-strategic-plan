import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll, getById } from "@/lib/content/graph";
import type { ParticipantSchema, GovernanceSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Participant = z.infer<typeof ParticipantSchema>;
type Governance = z.infer<typeof GovernanceSchema>;

export const metadata: Metadata = { title: "Who's Involved" };

export default function WhoIsInvolvedPage() {
  const participants = [
    ...getAll<Participant>("Person"),
    ...getAll<Participant>("Organization"),
    ...getAll<Participant>("GovernmentOrganization"),
    ...getAll<Participant>("Audience"),
  ];
  const governance = getAll<Governance>("marin:Governance")[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={[...participants, ...(governance ? [governance] : [])]} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Who&apos;s Involved
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        The departments, agencies, and residents that plan, decide, and carry out this work.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {participants.map((participant) => (
          <Card key={participant["@id"]} id={participant["@id"].split("/").pop()} className="scroll-mt-20">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                {participant["marin:role"]}
              </Badge>
              <CardTitle className="mt-1">{participant.name}</CardTitle>
              <CardDescription>{participant.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {governance && (
        <section id="governance" className="mt-14 scroll-mt-20">
          <h2 className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Governance
          </h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
                Executive sponsor
              </dt>
              <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
                {getById(governance["marin:executiveSponsor"])?.name}
              </dd>
            </div>
            <div>
              <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
                Steering committee
              </dt>
              <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
                {governance["marin:steeringCommittee"]
                  .map((id) => getById(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
                Planning team
              </dt>
              <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
                {governance["marin:planningTeam"]
                  .map((id) => getById(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
                Decision makers
              </dt>
              <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
                {governance["marin:decisionMakers"]
                  .map((id) => getById(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
