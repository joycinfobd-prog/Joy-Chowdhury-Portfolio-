import type { ReactElement, SVGProps } from "react";

/** Brand icons drawn in Lucide's stroke style (24×24, currentColor). */
function Brand({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Brand {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.2 9.1c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4l.7 1.6c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3-.1.5a5.2 5.2 0 0 0 2.5 2.4c.2.1.4 0 .5-.1l.5-.5c.2-.2.3-.2.5-.1l1.5.8c.2.1.3.2.3.4a1.6 1.6 0 0 1-1.1 1.3 3.2 3.2 0 0 1-2-.2 8.6 8.6 0 0 1-4.5-4.4 3 3 0 0 1-.4-2.1z" />
    </Brand>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Brand {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Brand>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Brand {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </Brand>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Brand {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Brand>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Brand {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </Brand>
  );
}

export const socialIconMap: Record<string, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  whatsapp: WhatsappIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
};
