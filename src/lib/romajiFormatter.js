import kuromoji from "kuromoji";
import * as wanakana from "wanakana";


export async function formatRomajiWithTokenizer(sentence) {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, tokenizer) => {
      if (err) return reject(err);

      const tokens = tokenizer.tokenize(sentence);

      const kanaWords = [];
      const romajiWords = [];

      for (const token of tokens) {
        const kana = token.reading
          ? token.reading.replace(/ー/g, "") // remove long vowels for clarity
          : token.surface_form; // fallback

        const kanaHiragana = kana ? wanakana.toHiragana(kana) : token.surface_form;
        kanaWords.push(token.surface_form);
        romajiWords.push(wanakana.toRomaji(kanaHiragana));
      }

      resolve({
        kanaWords,
        romajiWords,
        formatted: romajiWords.join(" "),
      });
    });
  });
}

