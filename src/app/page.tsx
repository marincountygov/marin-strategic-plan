import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Example homepage. Replace the copy and sections with the real site; the
 * patterns here — hero on marin-blue, token-only styling, dark pairing on
 * every surface — are the ones to keep.
 */
export default function Home() {
  return (
    <>
      <section className="bg-marin-blue-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="max-w-2xl font-product-display text-4xl font-semibold sm:text-5xl">
            A starting point for County of Marin websites
          </h1>
          {/* White, not a blue-100 tint: on marin-blue-500, normal-size text
              needs 4.5:1 and only white clears it (4.62:1; blue-100 is 3.93). */}
          <p className="mt-4 max-w-xl font-product-body text-lg text-white">
            County design tokens, accessible components, and built-in checks,
            extracted from Engage Marin. Build the site; the standards come
            along for free.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-marin-blue-700 hover:bg-marin-blue-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marin-blue-500"
            >
              <Link href="/design-tokens">Browse the design tokens</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          What the template gives you
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>County design tokens</CardTitle>
              <CardDescription>
                The Marin blue, gold, and red ramps, brand anchors, USWDS
                spacing and type scales, and semantic aliases — one source of
                truth in globals.css.
              </CardDescription>
            </CardHeader>
            <CardContent className="font-product-mono text-xs text-muted-foreground">
              bg-marin-blue-500 · text-marin-gold-700
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accessible components</CardTitle>
              <CardDescription>
                shadcn/ui primitives themed to the county palette, with the
                contrast and focus-ring fixes Engage Marin shipped through a
                county accessibility audit.
              </CardDescription>
            </CardHeader>
            <CardContent className="font-product-mono text-xs text-muted-foreground">
              npx shadcn@latest add ... for more
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Checks that travel</CardTitle>
              <CardDescription>
                Lint, typecheck, an automated WCAG scan, and a token-usage
                check run in CI on every push — the standard enforces itself.
              </CardDescription>
            </CardHeader>
            <CardContent className="font-product-mono text-xs text-muted-foreground">
              npm run verify
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
