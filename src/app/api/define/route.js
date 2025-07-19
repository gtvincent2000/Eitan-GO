export async function POST(request) {
    const body = await request.json();
    const word = body.word;

    console.log("Looking up definition for:", word);

    if(!word || typeof word!== 'string' || word.trim() === '') {
        return Response.json({ error: "Invalid word" }, { status: 400 });
    }
    try {
        const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            return Response.json({ error: "No definition found" }, { status: 404 });
        }

        const entry = data.data[0]; // Uses the first dictionary match
        const meanings = entry.senses.map(sense => sense.english_definitions.join(", "));
        const reading = entry.japanese[0].reading || "";
        const wordText = entry.japanese[0].word || word; // Fallback to the original word if no word is found

        return Response.json({
            definition: {
                word: wordText,
                reading,
                meanings,
            },
        });
    } catch (error) {
        console.error("Definition fetch error:", error);
        return Response.json({ error: "Failed to fetch definition" }, { status: 500 });
    }
}