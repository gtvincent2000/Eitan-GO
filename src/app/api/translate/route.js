import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

  const systemPrompt = `
    You are a translation engine that translates between English and Japanese.

    Return:
    1. The translated sentence.
    2. If the translation is in Japanese, include a list of word segments.
      Each word segment should contain:
      - "kanji": The word in kanji (or kana if no kanji)
      - "kana": The correct reading in hiragana only
      - "romaji": The Latin alphabet reading of the word

    Segmentation rules:
    - Split the Japanese sentence into individual, natural words or particles.
    - Each segment must represent one logical word or grammatical unit (e.g., は, とても, 好き, 日本).
    - DO NOT combine multiple particles or merge words into one segment.
    - "kana" must be in hiragana only. Do NOT include kanji or punctuation.
    - "romaji" must be in lowercase Latin characters with no kana or kanji.
    - Do not return furigana-style annotations inside the "kanji" or "kana" fields.

    Output strictly in JSON with this format:
    {
      "translation": "TRANSLATED_SENTENCE_HERE",
      "segments": [
        { "kanji": "漢字かかな", "kana": "かな", "romaji": "romaji" }
      ]
    }

    If the translation is in English, return an empty array for "segments".
    Do not include any extra commentary or explanation. Only return valid JSON.
    `;

    const userMessage =
      sourceLang === "en"
        ? `Translate this English sentence to Japanese and return the formatted output as described: "${text}"`
        : `Translate this Japanese sentence to English and return the formatted output as described: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    const json = JSON.parse(content || "{}");

    return NextResponse.json(json);
  } catch (err) {
    console.error("[/api/translate] Error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
