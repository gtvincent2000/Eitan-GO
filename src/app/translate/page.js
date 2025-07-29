'use client';

import { useState } from 'react';
import * as wanakana from 'wanakana';
import ClickableSentence from '@/components/ClickableSentence';
import DefinitionPopup from "@/components/DefinitionPopup";
import { createClient } from "@supabase/supabase-js";
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function saveWordToNotebook(definition) {
  const { word, reading, meanings } = definition;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User not signed in" };

  const userId = user.id;

  // Check if word already exists for that user
  const { data: existing, error: existingError } = await supabase
    .from("vocab")
    .select("id")
    .eq("word", word)
    .eq("user_id", userId)
    .single();

  if (existing) {
    return { alreadyExists: true };
  }

  const { data, error } = await supabase.from("vocab").insert([
    {
      word,
      kana: reading,
      romaji: wanakana.toRomaji(reading),
      meanings,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return { error };
  }

  return { success: true };
}

export default function TranslatePage() {

    // State Variables
    const [inputText, setInputText] = useState("");
    const [isJapanese, setIsJapanese] = useState(null);
    const [translations, setTranslations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [kanaWords, setKanaWords] = useState([]);
    const [romajiWords, setRomajiWords] = useState([]);
    const [targetLang, setTargetLang] = useState(null);
    const [activeWord, setActiveWord] = useState(null);
    const [definition, setDefinition] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const [popupCoords, setPopupCoords] = useState(null);
    const [showRomaji, setShowRomaji] = useState(false);

    const handleChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        setIsJapanese(wanakana.isJapanese(text));
        setTranslations([]); // Clear translations on input change
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        console.log("Button Clicked");

        setLoading(true);
        setTranslations([]);
        const targetLangValue = isJapanese ? "en" : "ja";
        setTargetLang(targetLangValue);

        try {
            const res = await fetch("/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: inputText,
                sourceLang: isJapanese ? "ja" : "en",
                targetLang: targetLangValue,
            }),
            });

            if (!res.ok) throw new Error("Translation failed");

            const data = await res.json();
            console.log("API response:", data);
            setTranslations([data.translation]);

            setTranslations([data.translation]);

            if (targetLangValue === "ja") {
                if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
                    const kanaList = data.segments.map(seg => seg.kanji);      
                    const romajiList = data.segments.map(seg => seg.romaji);    
                    setKanaWords(kanaList);
                    setRomajiWords(romajiList);
                } else {
                    // fallback to single-line rendering if segmentation fails
                    setKanaWords([data.translation]);
                    setRomajiWords([wanakana.toRomaji(data.translation)]);
                }
            }

        } catch (err) {
            console.error(err);
            toast.error("Translation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return(
        <main className="min-h-screen p-6 font-sans" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            <h1 className="text-2xl font-bold mb-4">Translate</h1>

            {/* Text Input Section */}
            <div className="mb-6">
                <label htmlFor="textInput" className="block mb-2">Enter text to translate:</label>
                <textarea
                    value={inputText}
                    onChange={handleChange}
                    id="textInput"
                    rows="2"
                    className="w-full p-2 rounded border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                        background: "var(--input-bg)",
                        color: "var(--input-text)",
                        borderColor: "var(--border-color)",
                    }}
                    placeholder="Type your text here..."
                ></textarea>
                {isJapanese !== null && (
                    <p className="text-sm mt-2 italic text-gray-500">
                        Detected Language: {isJapanese ? "Japanese" : "English"}
                    </p>
                )}
                <button
                    className="button-theme mt-2 px-4 py-2 rounded font-semibold"
                    onClick={handleTranslate}
                >
                    Translate
                </button>
            </div>

            {/* Translation Display Section */}
                {/* Loading Indicator */}
            {loading && (
                <div
                className="flex items-center gap-2 text-sm mt-1"
                style={{ color: "var(--foreground-secondary)" }}
                >
                <svg
                    className="animate-spin h-4 w-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    ></circle>
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                    ></path>
                </svg>
                Translating...
                </div>
            )}

            {/* Handle English Input */}
            {targetLang === "ja" && kanaWords.length > 0 && (
                <section>
                {/* Romaji Toggle Button */}
                    <div className="flex items-center gap-2 mt-4 mb-2">
                        <label htmlFor="romaji-toggle" className="text-sm font-medium">
                            Show Romaji
                        </label>
                        <button
                            id="romaji-toggle"
                            onClick={() => setShowRomaji(!showRomaji)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            showRomaji ? 'bg-blue-500 dark:bg-blue-700' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                showRomaji ? 'translate-x-6' : 'translate-x-1'
                            }`}
                            />
                        </button>
                    </div>
                <div className="mt-8 w-full flex flex-col items-center justify-center text-center">
                    {/* Translation Display */}
                    <h2 className="text-2xl font-bold mb-2">Translation:</h2>
                    <h1 className="text-3xl sm:text-6xl font-extrabold mb-4">
                        <ClickableSentence
                        kanaWords={kanaWords}
                        romajiWords={romajiWords}
                        showRomaji={showRomaji}
                        onWordClick={async (word, event) => {
                            const rect = event.target.getBoundingClientRect();
                            setPopupCoords({
                                top: rect.bottom + window.scrollY + 25,
                                left: rect.left + window.scrollX,
                            });

                            setActiveWord(word);
                            setDefinition(null);

                            try {
                                const res = await fetch("/api/define", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ word }),
                                });
                                const data = await res.json();
                                if (data && data.definition) {
                                setDefinition(data.definition);
                                } else {
                                setDefinition({
                                    word,
                                    reading: "",
                                    meanings: ["No definition found."],
                                });
                                }
                            } catch (err) {
                                console.error(err);
                                setDefinition("Failed to fetch definition.");
                            }
                        }}
                        />
                    </h1>
                    {/* Definition Popup */}
                    <DefinitionPopup
                        word={activeWord}
                        definition={definition}
                        position={popupCoords}
                        onClose={() => {
                            setActiveWord(null);
                            setDefinition(null);
                        }}
                        onSave={saveWordToNotebook}
                    />
                </div>
            </section>
            )}
            {/* Handle Japanese Input */}
            {targetLang === "en" && translations.length > 0 && (
                <div className="mt-8 w-full flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold mb-2">Translation:</h2>
                    <p className="text-lg">{translations[0]}</p>
                </div>
            )}


        </main>
    )

}