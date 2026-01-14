export const slugifyStr = (str: string) =>
  str
    .toLowerCase()
    .trim()
    // Normalize unicode characters (é → e, ñ → n)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    // Replace special characters with spaces first (so they become hyphens)
    .replace(/[^\w\s-]/g, " ")
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Collapse multiple hyphens
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

export const slugifyAll = (arr: string[]) => arr.map((str) => slugifyStr(str));
