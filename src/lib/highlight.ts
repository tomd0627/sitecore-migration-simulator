import { codeToHtml } from "shiki";

export async function highlight(
  code: string,
  lang: string
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      theme: "github-dark",
      colorReplacements: {
        "#6A737D": "#768EA9", // boost comment contrast for WCAG AA
      },
    });
  } catch {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}
