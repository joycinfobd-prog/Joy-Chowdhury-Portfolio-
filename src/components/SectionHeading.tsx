import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  highlight: string;
  sub?: string;
  align?: "center" | "left";
};

/** Consistent section header: mono eyebrow chip → big title → subtitle. */
export default function SectionHeading({ eyebrow, title, highlight, sub, align = "center" }: Props) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <Reveal className={`flex flex-col gap-4 ${alignCls}`} stagger={0.12}>
      <span className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-inksoft">
        <span className="h-1.5 w-1.5 rounded-full bg-gred" />
        {eyebrow}
      </span>
      <h2 className="max-w-2xl font-display text-[1.75rem] font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
        {title} <span className="text-google">{highlight}</span>
      </h2>
      {sub && <p className="max-w-xl text-[14.5px] leading-relaxed text-inksoft sm:text-base">{sub}</p>}
    </Reveal>
  );
}
