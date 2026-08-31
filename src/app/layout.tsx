import type { Metadata } from "next";
import { IBM_Plex_Mono, Jost, Open_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variable classes MUST live on <html>, not <body>: the theme
    // tokens in globals.css (--font-heading etc.) are declared on :root and
    // reference these variables, and a custom property resolves its var()s
    // where it is declared. On <body> the references are undefined at :root
    // and every font token computes invalid — the whole site silently falls
    // back to system fonts.
    <html
      lang="en"
      className={`${jost.variable} ${openSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
