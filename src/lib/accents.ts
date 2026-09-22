export type Accent = "gblue" | "gred" | "gyellow" | "ggreen";

export const accents: Record<
  Accent,
  {
    text: string;
    bgSoft: string;
    ring: string;
    iconWell: string;
    dot: string;
    bar: string;
    glow: string;
    chip: string;
  }
> = {
  gblue: {
    text: "text-gblue",
    bgSoft: "bg-gblue/10",
    ring: "ring-gblue/25",
    iconWell: "bg-gblue/12 text-gblue ring-1 ring-gblue/25",
    dot: "bg-gblue",
    bar: "from-gblue to-gblue/25",
    glow: "hover:shadow-[0_40px_90px_-30px_rgba(66,133,244,0.45)] hover:border-gblue/40",
    chip: "bg-gblue/10 text-gblue ring-1 ring-gblue/25",
  },
  gred: {
    text: "text-gred",
    bgSoft: "bg-gred/10",
    ring: "ring-gred/25",
    iconWell: "bg-gred/12 text-gred ring-1 ring-gred/25",
    dot: "bg-gred",
    bar: "from-gred to-gred/25",
    glow: "hover:shadow-[0_40px_90px_-30px_rgba(234,67,53,0.4)] hover:border-gred/40",
    chip: "bg-gred/10 text-gred ring-1 ring-gred/25",
  },
  gyellow: {
    text: "text-gyellow",
    bgSoft: "bg-gyellow/12",
    ring: "ring-gyellow/30",
    iconWell: "bg-gyellow/15 text-gyellow ring-1 ring-gyellow/30",
    dot: "bg-gyellow",
    bar: "from-gyellow to-gyellow/25",
    glow: "hover:shadow-[0_40px_90px_-30px_rgba(251,188,5,0.45)] hover:border-gyellow/50",
    chip: "bg-gyellow/12 text-gyellow ring-1 ring-gyellow/30",
  },
  ggreen: {
    text: "text-ggreen",
    bgSoft: "bg-ggreen/10",
    ring: "ring-ggreen/25",
    iconWell: "bg-ggreen/12 text-ggreen ring-1 ring-ggreen/25",
    dot: "bg-ggreen",
    bar: "from-ggreen to-ggreen/25",
    glow: "hover:shadow-[0_40px_90px_-30px_rgba(52,168,83,0.4)] hover:border-ggreen/40",
    chip: "bg-ggreen/10 text-ggreen ring-1 ring-ggreen/25",
  },
};
