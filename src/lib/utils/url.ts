/** True for links that leave this site: "https://…" or "//…". */
const isExternalUrl = (href: string) => /^(https?:)?\/\//.test(href);

export { isExternalUrl };
