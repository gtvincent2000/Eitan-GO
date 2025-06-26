import kuromoji from "kuromoji";
import { toRomaji } from "wanakana";
import path from "path";

let tokenizer = null;

export async function formatRomaji(sentence) {
  if (!tokenizer) {
    tokenizer = await new Promise((resolve, reject) => {
      kuromoji.builder({
        dicPath: path.join(process.cwd(), "node_modules/kuromoji/dict"),
      }).build((err, builtTokenizer) => {
        if (err) reject(err);
        else resolve(builtTokenizer);
      });
    });
  }

  const tokens = tokenizer.tokenize(sentence);
  const kanaWords = tokens.map(t => t.surface_form);
  const romajiWords = tokens.map(t => toRomaji(t.surface_form));
  const formatted = romajiWords.join(" ");

  return {
    kanaWords,
    romajiWords,
    formatted,
  };
}
