import { KANA_ITEMS } from "@/lib/kana/data";

/**
 * Build a question pool based on user config
 * config = {
 *   scripts: ["hiragana","katakana"], // at least one
 *   includeDakuten: boolean,
 *   includeYouon: boolean
 * }
 */
export function buildPool(config) {
  const {
    scripts = ["hiragana", "katakana"],
    includeDakuten = false,
    includeYouon = false,
  } = config ?? {};

  return KANA_ITEMS.filter((i) => {
    // script filter
    if (!scripts.includes(i.script)) return false;

    // tag filters:
    const isDakuten = i.tags?.includes("dakuten") || i.tags?.includes("handakuten");
    const isYouon = i.tags?.includes("youon");
    const isBasic = i.tags?.includes("basic");

    // include basic always; include others based on toggles
    if (isBasic) return true;
    if (isDakuten && includeDakuten) return true;
    if (isYouon && includeYouon) return true;

    return false;
  });
}
