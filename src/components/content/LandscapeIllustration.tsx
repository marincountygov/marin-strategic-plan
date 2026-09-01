/**
 * The layered landscape motif from Engage Marin's own hero — taken directly
 * from their page source (they provided it), not re-approximated. It
 * already targets the same design-system token names this site uses
 * (marin-blue/marin-gold/marin-green/marin-brown), since both sites share
 * the same underlying county design system — so it drops in unmodified.
 * Purely decorative, so it's aria-hidden.
 */
export function LandscapeIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 1200 180"
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      <rect width="1200" height="180" className="fill-marin-gold-50 dark:fill-marin-blue-950" />
      <circle cx="812" cy="62" r="30" className="fill-marin-gold-300" />
      <path
        d="M0 108Q96 106 190 100Q268 94 340 82Q404 70 452 54Q502 36 534 26L560 14L588 32Q610 46 632 51Q656 38 686 46Q730 58 776 68Q834 80 890 84Q950 88 1010 84Q1100 78 1200 82L1200 180L0 180Z"
        className="fill-marin-blue-200"
      />
      <path
        d="M0 121Q80 96 164 110Q244 123 310 108Q396 87 466 102Q548 121 616 110Q694 96 764 115Q846 138 918 119Q998 98 1070 117Q1140 136 1200 115L1200 180L0 180Z"
        className="fill-marin-green/45"
      />
      <path
        d="M0 143Q88 120 172 131Q252 143 328 133Q412 122 490 137Q572 152 648 141Q730 128 808 141Q892 154 968 141Q1052 130 1132 141Q1168 147 1200 139L1200 180L0 180Z"
        className="fill-marin-green"
      />
      <path
        d="M0 156Q140 149 288 155Q436 160 584 155Q732 149 880 155Q1028 160 1120 156Q1164 155 1200 156L1200 180L0 180Z"
        className="fill-marin-blue-500"
      />
      <path
        d="M0 139Q110 124 216 137Q322 150 420 166Q516 180 620 180L0 180Z"
        className="fill-marin-brown/85"
      />
    </svg>
  );
}
