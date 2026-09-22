/** Ambient light-liquid backdrop: floating blurred Google-colored spheres + film grain. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbfcfe_0%,#f8f9fa_38%,#f4f6f9_100%)]" />

      {/* floating colored light spheres */}
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-gblue/25 blur-[120px] animate-float-a" />
      <div className="absolute -right-48 top-[8%] h-[30rem] w-[30rem] rounded-full bg-gred/20 blur-[130px] animate-float-b" />
      <div className="absolute left-[12%] top-[58%] h-[26rem] w-[26rem] rounded-full bg-gyellow/20 blur-[120px] animate-float-c" />
      <div className="absolute -bottom-48 right-[8%] h-[32rem] w-[32rem] rounded-full bg-ggreen/20 blur-[130px] animate-float-b" />
      <div className="absolute left-[42%] top-[32%] h-72 w-72 rounded-full bg-gblue/15 blur-[100px] animate-float-a" />

      {/* faint prism arcs */}
      <div className="absolute left-1/2 top-0 h-[60rem] w-[120rem] -translate-x-1/2 -translate-y-2/3 rounded-full bg-white/50 blur-3xl" />
    </div>
  );
}
