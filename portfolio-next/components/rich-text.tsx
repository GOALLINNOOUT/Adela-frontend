function normalizeHtml(html: string) {
  if (/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }

  return html
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function RichText({ html }: { html: string }) {
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: normalizeHtml(html) }} />;
}
