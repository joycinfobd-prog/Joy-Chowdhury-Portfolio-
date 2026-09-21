/* ------------------------------------------------------------------
   ATS-friendly resume — same content + branding as the portfolio.
   Single column, Helvetica, no tables/graphics.  Run:
     node scripts/generate-resume.mjs
------------------------------------------------------------------- */
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "Joy_Chowdhury_Resume.pdf");
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

/* Google-aligned brand (matches the portfolio) */
const BLUE = "#4285F4";
const INK = "#1F2937";
const MUTED = "#4B5563";
const RULE = "#4285F4";

const M = 48;
const doc = new PDFDocument({
  size: "A4",
  margins: { top: 40, bottom: 40, left: M, right: M },
  info: {
    Title: "Joy Chowdhury — Resume",
    Author: "Joy Chowdhury",
    Subject: "Business Administration Student & AI Prompt Specialist",
    Keywords:
      "AI Prompt Engineering, Accounting, Digital Marketing, Corporate Governance, Generative AI, Bangladesh",
  },
});
doc.pipe(fs.createWriteStream(OUT_PATH));

const W = doc.page.width - M * 2;

function ensure(h) {
  if (doc.y + h > doc.page.height - 40) doc.addPage();
}

function section(title) {
  ensure(36);
  doc.moveDown(0.55);
  doc.font("Helvetica-Bold").fontSize(11.5).fillColor(BLUE).text(title.toUpperCase(), { characterSpacing: 0.6 });
  const y = doc.y + 2;
  doc.moveTo(M, y).lineTo(M + W, y).lineWidth(1.2).strokeColor(RULE).stroke();
  doc.y = y + 8;
}

function p(text) {
  ensure(18);
  doc.font("Helvetica").fontSize(9.5).fillColor(INK).text(text, { align: "left", lineGap: 1.6, width: W });
}

function bullet(text) {
  ensure(16);
  doc.font("Helvetica").fontSize(9.4).fillColor(INK).text(`•  ${text}`, { width: W, lineGap: 1.4 });
}

function jobTitle(role) {
  ensure(22);
  doc.font("Helvetica-Bold").fontSize(10.4).fillColor(INK).text(role, { width: W });
}

function jobMeta(company, dates) {
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(BLUE).text(company, { continued: true });
  doc.font("Helvetica").fillColor(MUTED).text(`    |    ${dates}`);
}

function tags(items) {
  if (!items?.length) return;
  ensure(14);
  doc.font("Helvetica").fontSize(8.6).fillColor(MUTED).text(items.join("  ·  "), { width: W });
}

/* ============================== HEADER ============================== */
doc.font("Helvetica-Bold").fontSize(22).fillColor(BLUE).text("JOY CHOWDHURY");
doc.moveDown(0.08);
doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text("Business Administration Student  |  AI Prompt Specialist");
doc.moveDown(0.12);
doc
  .font("Helvetica")
  .fontSize(8.8)
  .fillColor(MUTED)
  .text("Mirpur, Sirajganj Sadar, Sirajganj, Bangladesh");
doc
  .font("Helvetica")
  .fontSize(8.8)
  .fillColor(MUTED)
  .text("Phone: +8801794608874    Email: chowdhuryjoy.info.bd@gmail.com    WhatsApp: 01794608874");
doc
  .font("Helvetica")
  .fontSize(8.8)
  .fillColor(MUTED)
  .text("LinkedIn: linkedin.com/in/iam-joy    Facebook: facebook.com/chowdhury136    Instagram: instagram.com/______joychowdhury__");

const hy = doc.y + 7;
doc.moveTo(M, hy).lineTo(M + W, hy).lineWidth(2).strokeColor(BLUE).stroke();
doc.y = hy + 10;

/* ============================== SUMMARY ============================== */
section("Professional Summary");
p(
  "As a Business Administration student and certified AI Prompt Specialist, I combine corporate governance, financial accounting expertise, and advanced Generative AI implementation into operational workflows that make businesses run smarter. Serving as a Board Director at Shikkha IT Limited and through practical background in accounts, digital marketing and customer operations, I excel at leveraging AI optimization techniques (Chain-of-Thought, Few-Shot Prompting, Persona Framing) to enhance business efficiency, decision-making, and automation. Certified by Grameenphone Academy in Generative AI & Prompt Engineering and recognized nationally at GRIC Startup League. Tech enthusiast, always learning and evolving."
);

/* ============================== EXPERIENCE ============================== */
section("Work Experience");

jobTitle("Member, Board of Directors & Financial Accounting Operations");
jobMeta("Shikkha IT Limited", "Recent / Present");
doc.moveDown(0.12);
bullet("Serve on the Board of Directors, contributing to strategic decision-making, corporate governance, and organizational growth strategies.");
bullet("Utilize advanced AI Prompt Engineering and LLM workflows to streamline daily business operations, analysis, and quality evaluation.");
bullet("Migrated financial records from manual cash logs to a professional, audit-ready double-entry accounting system.");
bullet("Developed an automated Google Sheets framework — including Chart of Accounts, Ledgers, and financial dashboards — ensuring real-time reporting.");
bullet("Resolved long-standing financial inconsistencies by implementing a structured Asset Register and Liability tracking system.");
tags(["Corporate Governance", "Double-Entry Accounting", "AI Prompt Engineering", "Google Sheets Automation"]);
doc.moveDown(0.4);

jobTitle("Digital Marketing Specialist");
jobMeta("Freelance / Professional Services", "Freelance");
doc.moveDown(0.12);
bullet("Delivered end-to-end digital marketing support — content creation, campaigns and audience engagement — for 15+ Facebook pages.");
bullet("Took multiple pages from a standing start of zero followers to recognized, engaged brand pages using generative AI-optimized content workflows.");
bullet("Built repeatable content and growth systems so pages kept growing consistently, not just during active campaigns.");
tags(["15+ Facebook Pages", "Zero-to-Brand Growth", "Content Strategy", "Generative AI Tools"]);
doc.moveDown(0.4);

jobTitle("Customer Support & Accountant");
jobMeta("Genuine Social Enterprise (Sirajganj Branch)", "Feb 2021 – Oct 2024");
doc.moveDown(0.12);
bullet("Contributed to daily operations while gaining valuable insights into ethical and sustainable business models.");
bullet("Handled day-to-day accounts and maintained customer relations to ensure smooth business operations.");
tags(["Accounts", "Customer Relations", "Sustainable Business"]);
doc.moveDown(0.4);

jobTitle("Photographer");
jobMeta("Rose Letter Photography", "2019 – 2022");
doc.moveDown(0.12);
bullet("Delivered wedding photography coverage with a storytelling, client-first approach.");
bullet("Produced commercial photography for brands and small businesses.");
bullet("Shot fashion photography focused on styling, lighting and creative direction.");
tags(["Wedding Photography", "Commercial Photography", "Fashion Photography"]);

/* ============================== PROJECT ============================== */
section("Selected Work");
jobTitle("AI-Engineered Personal Website");
doc.moveDown(0.08);
p(
  "Designed, built and deployed a live personal portfolio using AI-assisted engineering — from prompt-driven concept to a fully usable product, without traditional hand-coding."
);
tags(["AI Web Development", "Prompt-to-Product", "Live & In Use"]);

/* ============================== SKILLS ============================== */
section("Skills");
doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("AI & Prompt Engineering:  ", { continued: true });
doc.font("Helvetica").text("Chain-of-Thought Prompting, Few-Shot Prompting, Persona Framing, AI-Assisted Web Development");

doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("LLM Optimization:  ", { continued: true });
doc
  .font("Helvetica")
  .text("ChatGPT, Claude, Gemini, Deepseek, Midjourney, Microsoft Copilot, Grammarly, NotebookLM, Canva AI, Gamma");

doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("Accounting & Finance:  ", { continued: true });
doc.font("Helvetica").text("Financial Accounting, Double-Entry Systems, Google Sheets Automation");

doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("Digital Marketing:  ", { continued: true });
doc.font("Helvetica").text("Facebook Page Campaigns, Zero-to-Brand Growth Strategy, Content Creation");

doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("Software & Tools:  ", { continued: true });
doc
  .font("Helvetica")
  .text(
    "MS Word, MS Excel, MS PowerPoint, Adobe Photoshop, Adobe Illustrator, Canva, CapCut (Video Editing), Google Sheets"
  );

doc.font("Helvetica-Bold").fontSize(9.4).fillColor(INK).text("Soft Skills & Leadership:  ", { continued: true });
doc
  .font("Helvetica")
  .text(
    "Corporate Governance, Strategic Planning, Leadership, Team Management, Teamwork, Time Management, Effective Communication, Public Speaking, Negotiation, Critical Thinking, Problem Solving, Adaptability, Decision Making, Conflict Resolution"
  );

/* ============================== CERTIFICATIONS ============================== */
section("Certifications & Honors");

jobTitle("Certified in Generative AI & Prompt Engineering");
jobMeta("Grameenphone Academy", "Professional Certification");
p(
  "Mastered end-to-end AI prompt frameworks, LLM optimization, and practical application."
);
doc.moveDown(0.22);

jobTitle("National Certificate of Recognition – 1st Runner-up");
jobMeta("Startup League, GRIC National Round", "National Award");
p(
  "Represented Shikkha IT Limited as part of the core team, managing project strategy, pitching, and execution at the national round. As 1st Runner-up, the team earned an opportunity to travel to Turkey for further recognition — a trip we chose not to take, by our own decision."
);
doc.moveDown(0.22);

jobTitle("Digital Marketing Certification");
jobMeta("Professional Certification Program", "Certified Specialist");
p(
  "Certified in digital marketing fundamentals and applied practice — validated through real campaigns run for 15+ Facebook pages, growing them from zero following into recognized brand pages."
);
doc.moveDown(0.22);

jobTitle("Mastermind Program — Mind Management");
jobMeta("Mastermind Programming for Peace & Happiness", "Serial No. SL.0831  |  Reg. MP104-290  |  10 April 2023");
p(
  "Certified in Mind Management — focused on mental clarity, emotional regulation and personal growth."
);
doc.moveDown(0.22);

jobTitle("Computer Fundamentals & MS Office");
jobMeta("White Mark", "Skill Development Certification");
p(
  "Practical computer literacy covering operating systems, the complete MS Office suite, typing, internet research and everyday office documentation workflows."
);
doc.moveDown(0.22);

jobTitle("The Science & Art of Living");
jobMeta("SAAOL Research Foundation", "Additional Training");

/* ============================== EDUCATION ============================== */
section("Education");
jobTitle("BBA in Accounting");
jobMeta("Sirajganj Govt. College (NU)", "2021 – Running");
doc.moveDown(0.22);
jobTitle("HSC (Business Studies)");
jobMeta("Islamia Govt. College", "Completed");
doc.moveDown(0.22);
jobTitle("SSC (Science)");
jobMeta("S B Railway Colony School & College", "Completed");

/* ============================== LANGUAGES ============================== */
section("Languages");
p("Bangla — Native / Professional     |     English — Professional Working     |     Hindi — Conversational");

doc.end();
await new Promise((r) => doc.on("end", r));
console.log("Resume PDF generated at:", OUT_PATH);
