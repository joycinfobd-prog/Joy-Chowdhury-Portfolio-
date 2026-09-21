/* ------------------------------------------------------------------
   Direct email delivery — no mail app, no Outlook popup.

   Primary: FormSubmit.co AJAX  (no API key; first message asks the
            inbox owner to click a one-time confirmation link).
   Optional: Web3Forms if an access key is saved in the console.
------------------------------------------------------------------- */

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SendResult = { ok: true; via: "api" } | { ok: false; via: "error"; error?: string };

export async function sendContact(
  payload: ContactPayload,
  opts: { accessKey: string; toEmail: string; toName: string }
): Promise<SendResult> {
  const subject = payload.subject?.trim() || `New portfolio message from ${payload.name}`;
  const to = opts.toEmail.trim();

  // 1) Web3Forms — only if a real key has been saved.
  if (opts.accessKey && opts.accessKey.trim().length > 10) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: opts.accessKey.trim(),
          subject,
          from_name: `${payload.name} (Portfolio)`,
          replyto: payload.email,
          name: payload.name,
          email: payload.email,
          message: payload.message,
          botcheck: "",
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && data.success) return { ok: true, via: "api" };
    } catch {
      /* fall through to FormSubmit */
    }
  }

  // 2) FormSubmit — sends straight to the inbox, no mail client.
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _subject: subject,
        _template: "table",
        _captcha: "false",
        _honey: "",
        message: payload.message,
      }),
    });
    const data = (await res.json()) as { success?: string | boolean; message?: string };
    if (res.ok && (data.success === true || data.success === "true")) {
      return { ok: true, via: "api" };
    }
    return {
      ok: false,
      via: "error",
      error: data.message || "Could not deliver the message. Please try again.",
    };
  } catch (err) {
    return {
      ok: false,
      via: "error",
      error: err instanceof Error ? err.message : "Network error. Please try again.",
    };
  }
}
