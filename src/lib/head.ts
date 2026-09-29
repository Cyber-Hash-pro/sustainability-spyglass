export function appHead(title: string, description: string) {
  const t = `${title} — Verdant Ledger`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  };
}
