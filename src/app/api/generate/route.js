import OpenAI from "openai";
import { formatRomajiWithTokenizer } from "@/lib/romajiFormatter";

export async function POST(request) {
  try {
    const body = await request.json();
    const word = body.word;

    console.log("Word received from frontend:", word);

    if (!word || typeof word !== "string" || word.trim() === "") {
      console.warn("Invalid input received.");
      return Response.json(
        { error: "Invalid input. Please provide a valid word." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY in environment variables.");
      return Response.json(
        { error: "Server misconfiguration. Missing API key." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for beginner Japanese learners.
                    Generate a short, simple Japanese sentence that uses the given word.

                    - You may use kanji, but keep the sentence appropriate for learners.
                    - The kanji should be common (JLPT N5/N4 level).
                    - Keep the sentence short and clear.
                    - Do not explain anything, just return the result.

                    Respond *only* in this exact format:

                    Japanese: <your sentence with kanji and kana>
                    English: <English translation of the sentence>`,
        },
        {
          role: "user",
          content: `Use the word "${word}" in a short sentence.`,
        },
      ],
      max_tokens: 180,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      console.error("OpenAI response had no content:", response);
      return Response.json(
        { error: "No content returned from OpenAI." },
        { status: 500 }
      );
    }

    console.log("Raw OpenAI content:", content);

    let japanese = "";
    let english = "";

    const lines = content.split("\n");
    for (const line of lines) {
      if (line.toLowerCase().startsWith("japanese:")) {
        japanese = line.replace(/japanese:/i, "").trim();
      } else if (line.toLowerCase().startsWith("english:")) {
        english = line.replace(/english:/i, "").trim();
      }
    }

    const romaji = await formatRomajiWithTokenizer(japanese);

    console.log("Parsed Japanese:", japanese);
    console.log("Parsed English:", english);

    return Response.json({
      sentence: japanese,
      translation: english,
      romaji: romaji,
    });
  } catch (error) {
    console.error("Error generating sentence:", error);
    return Response.json(
      { error: "Failed to generate sentence. Please try again." },
      { status: 500 }
    );
  }
}
