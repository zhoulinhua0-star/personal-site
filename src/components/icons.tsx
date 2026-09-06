/**
 * Inline SVG icons. No icon library, no emoji.
 * Every icon is decorative — the surrounding link always carries the label.
 */
import type { SVGProps } from "react";
import type { LinkKind } from "@/data/personal";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M5 11L11 5M11 5H6.2M11 5v4.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M8 .8a7.2 7.2 0 0 0-2.28 14.03c.36.07.49-.16.49-.35v-1.2C4.2 13.72 3.78 12.5 3.78 12.5c-.33-.84-.8-1.06-.8-1.06-.65-.45.05-.44.05-.44.72.05 1.1.74 1.1.74.64 1.1 1.68.78 2.09.6.06-.47.25-.79.45-.97-1.6-.18-3.28-.8-3.28-3.55 0-.79.28-1.43.74-1.93-.07-.18-.32-.91.07-1.9 0 0 .6-.2 1.98.73a6.9 6.9 0 0 1 3.6 0c1.38-.93 1.98-.74 1.98-.74.39 1 .14 1.73.07 1.91.46.5.74 1.14.74 1.93 0 2.76-1.69 3.37-3.29 3.55.26.22.49.66.49 1.34v1.98c0 .19.13.42.5.35A7.2 7.2 0 0 0 8 .8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3.4 5.9H1.2V15h2.2V5.9ZM2.3 1.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM14.8 9.7c0-2.4-1.3-3.9-3.2-3.9-1.2 0-1.9.6-2.3 1.2V5.9H7.1V15h2.2V9.9c0-1.1.5-1.9 1.5-1.9s1.5.7 1.5 1.9V15h2.5V9.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon(props: IconProps) {
  // The X mark is published on a 24-unit grid; overriding the viewBox keeps the
  // official geometry rather than re-tracing it at 16.
  return (
    <svg {...base} viewBox="0 0 24 24" {...props}>
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ResumeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 1.5h5l3 3v10H4v-13Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9 1.6V4.6h3M6 8h4M6 10.6h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect
        x="1.4"
        y="3.4"
        width="13.2"
        height="9.2"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="m2.4 4.8 5.6 3.9 5.6-3.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const registry: Record<LinkKind, (props: IconProps) => React.ReactElement> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  resume: ResumeIcon,
  email: EmailIcon,
};

export function LinkIcon({ kind, ...props }: IconProps & { kind: LinkKind }) {
  const Component = registry[kind];
  return <Component {...props} />;
}
