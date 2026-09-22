import { useContent } from "../lib/content";

const dotColors = ["bg-gblue", "bg-gred", "bg-gyellow", "bg-ggreen"];

/** Infinite tech ticker — glass strip with edge fades. */
export default function Marquee() {
  const { marqueeTech } = useContent();
  const items = [...marqueeTech, ...marqueeTech];
  return (
    <section aria-label="Technologies" className="relative py-6">
      <div className="glass-soft marquee-mask mx-auto max-w-6xl overflow-hidden rounded-full py-4">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10">
          {items.map((tech, i) => (
            <span key={`${tech}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
              <span className={`h-1.5 w-1.5 rounded-full ${dotColors[i % dotColors.length]}`} />
              <span className="font-mono text-[13px] font-medium tracking-wide text-inksoft">{tech}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
