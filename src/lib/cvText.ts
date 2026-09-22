import type { SiteContent } from "../data/defaults";

/** Strip protocol / www / trailing slash so links read clean in ATS text. */
function cleanUrl(href: string): string {
  return href
    .replace(/^mailto:/i, "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/**
 * Build the exact ATS-readable plain-text version of the CV from live
 * site content. Same order + branding labels as the PDF:
 * Header → Summary → Experience → Selected Work → Skills →
 * Certifications → Education → Languages.
 */
export function buildCvPlainText(c: SiteContent): string {
  const L: string[] = [];
  const p = c.profile;

  const address = p.address.includes("Bangladesh") ? p.address : `${p.address}, Bangladesh`;
  const whatsapp = c.socials.find((s) => s.label.toLowerCase() === "whatsapp");
  const links = c.socials.filter(
    (s) => s.icon !== "mail" && s.href && !s.href.toLowerCase().startsWith("mailto:")
  );

  // ---------- header ----------
  L.push(p.name.toUpperCase());
  L.push(`${p.roleLineA} | ${p.roleLineB}`);
  L.push(address);
  L.push(
    [`Phone: ${p.phone}`, `Email: ${p.email}`, whatsapp ? `WhatsApp: ${whatsapp.handle}` : ""]
      .filter(Boolean)
      .join("    ")
  );
  if (links.length > 0) {
    L.push(links.map((s) => `${s.label}: ${cleanUrl(s.href)}`).join("    "));
  }
  L.push("");

  // ---------- summary ----------
  L.push("PROFESSIONAL SUMMARY");
  L.push(p.motto ? `${p.profileText} ${p.motto}` : p.profileText);
  L.push("");

  // ---------- experience ----------
  L.push("WORK EXPERIENCE");
  c.experience.forEach((job) => {
    L.push("");
    L.push(job.role);
    L.push(`${job.company} | ${job.period}`);
    job.points.forEach((point) => L.push(`•  ${point}`));
    if (job.tags.length > 0) L.push(job.tags.join("  ·  "));
  });
  L.push("");

  // ---------- selected work ----------
  if (c.systemsBuilt.length > 0) {
    L.push("SELECTED WORK");
    c.systemsBuilt.forEach((s) => {
      L.push("");
      L.push(s.title);
      L.push(s.detail);
      if (s.tags.length > 0) L.push(s.tags.join("  ·  "));
    });
    L.push("");
  }

  // ---------- skills ----------
  L.push("SKILLS");
  c.skillCategories.forEach((cat) => {
    const items = [...cat.skills.map((s) => s.name), ...(cat.extraTools ?? [])];
    L.push(`${cat.title}: ${items.join(", ")}`);
  });
  if (c.softwareTools.length > 0) L.push(`Software & Tools: ${c.softwareTools.join(", ")}`);
  if (c.softSkills.length > 0) L.push(`Soft Skills & Leadership: ${c.softSkills.join(", ")}`);
  L.push("");

  // ---------- certifications ----------
  L.push("CERTIFICATIONS & HONORS");
  c.certifications.forEach((cert) => {
    L.push("");
    L.push(cert.name);
    L.push(`${cert.issuer} | ${cert.badge}`);
    L.push(cert.detail);
    if (cert.skills.length > 0) L.push(`Skills: ${cert.skills.join(", ")}`);
  });
  c.additionalTrainings.forEach((t) => {
    L.push("");
    L.push(t.name);
    L.push(`${t.issuer} | Additional Training`);
  });
  L.push("");

  // ---------- education ----------
  L.push("EDUCATION");
  c.education.forEach((e) => {
    L.push("");
    L.push(e.degree);
    L.push(`${e.school} | ${e.period}${e.score ? ` | ${e.score}` : ""}`);
  });
  L.push("");

  // ---------- languages ----------
  L.push("LANGUAGES");
  L.push(c.languages.map((l) => `${l.name} — ${l.level}`).join(" | "));

  return L.join("\n");
}
