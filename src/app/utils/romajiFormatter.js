import kuromoji from "kuromoji";
import { toRomaji } from "wanakana";

export function formatRomaji(kanaSentence) {
  console.log("formatRomaji input:", kanaSentence); // Step 1 log

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, tokenizer) => {
      if (err) {
        console.error("Tokenizer build error:", err);
        return reject(err);
      }

      const tokens = tokenizer.tokenize(kanaSentence);
      console.log("Tokens:", tokens); // Step 2 log

      const romajiWords = tokens.map((token) => {
        const kana = token.reading || token.surface_form;
        return toRomaji(kana);
      });

      const result = romajiWords.join(" ");
      console.log("Formatted romaji:", result); // Step 3 log

      resolve(result);
    });
  });
}