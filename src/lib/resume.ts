import { resumePdfBase64 } from "../data/resumeData";

const RESUME_FILE_NAME = "Joy_Chowdhury_Resume.pdf";

/** Decode the embedded base64 PDF into a Blob and trigger a reliable download. */
export function downloadResume() {
  try {
    const binary = atob(resumePdfBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = RESUME_FILE_NAME;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Release the object URL after the click has been processed.
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (err) {
    // Fallback: open the data URI directly if Blob download is unavailable.
    console.warn("Resume download fallback used:", err);
    window.open(`data:application/pdf;base64,${resumePdfBase64}`, "_blank");
    return false;
  }
}

/** The embedded PDF as a data URI (useful as an href fallback). */
export const resumeDataUri = `data:application/pdf;base64,${resumePdfBase64}`;
