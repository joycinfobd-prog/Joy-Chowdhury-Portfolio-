import { resumePdfBase64 } from "../data/resumeData";

export const RESUME_FILE_NAME = "Joy_Chowdhury_Resume.pdf";

let cachedBlobUrl: string | null = null;

/** Decode the embedded base64 PDF once and hand back a reusable object URL. */
export function getResumeBlobUrl(): string {
  if (cachedBlobUrl) return cachedBlobUrl;
  const binary = atob(resumePdfBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  cachedBlobUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  return cachedBlobUrl;
}

/** Open the print dialog (destination = Save as PDF) — fallback for browsers
 *  that prefer to view PDFs instead of downloading them. */
export function printResume(): void {
  window.setTimeout(() => window.print(), 120);
}

/** The embedded PDF as a data URI (last-resort href). */
export const resumeDataUri = `data:application/pdf;base64,${resumePdfBase64}`;
