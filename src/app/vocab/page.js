'use client';
import { useState, useEffect } from 'react';
import WordInput from '@/components/WordInput';
import { toRomaji } from 'wanakana';
import ClickableSentence from '@/components/ClickableSentence';
import { supabase } from '@/lib/supabaseClient';
import * as wanakana from 'wanakana';
import toast from 'react-hot-toast';

// This is the main page of the application
// It handles the main functionality of generating sentences, saving vocabulary, and displaying definitions
export default function Home() {
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [definition, setDefinition] = useState(null);
  const [showRomaji, setShowRomaji] = useState(false);
  const [romaji ,setRomaji] = useState('');
  const [clickedWord, setClickedWord] = useState('');
  const [kanaWords, setKanaWords] = useState([]);
  const [romajiWords, setRomajiWords] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [flippedCards, setFlippedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editMode, setEditMode] = useState(false);


  // Function to handle word click in the generated sentence
  const handleWordClick = async (word) => {
    setSelectedWord(word);

    try {
      setLoading(true);
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
          meanings: ["No definition found."]
        });
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      toast.error("Failed to fetch definition.");
    } finally {
      setLoading(false);
    }
  };

  const saveWordToNotebook = async (word) => {
    const toastId = toast.loading("Fetching definition...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.dismiss(toastId); 
        toast.error("You must be signed in to save words.");
        return;
      }

      const userId = user.id;

      const res = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const { definition } = await res.json();

      if (!definition || !definition.word || !definition.meanings) {
        toast.error("Invalid definition received.", { id: toastId });
        return;
      }

      const kana = definition.reading || "";
      const romaji = kana ? wanakana.toRomaji(kana) : "";

      const { data: existing } = await supabase
        .from("vocab")
        .select("*")
        .eq("word", definition.word)
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        toast.error(`"${definition.word}" is already in your notebook!`, { id: toastId });
        return;
      }

      const { error } = await supabase.from("vocab").insert([
        {
          word: definition.word,
          kana,
          romaji,
          meanings: definition.meanings,
          user_id: userId,
        },
      ]);

      if (error) {
        toast.error("Failed to save word.", { id: toastId });
        console.error(error.message);
      } else {
        toast.success("Word saved to notebook!", { id: toastId });
        fetchVocabList();
      }
    } catch (error) {
      console.error("Error saving word:", error);
      toast.error("Failed to save word.", { id: toastId });
    }
  };

  // Function to fetch the vocabulary list from Supabase
  const fetchVocabList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("vocab")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching vocab list:", error.message);
      } else {
        setVocabList(data);
        console.log("Fetched vocab list:", data);
      }
  }

  // Function to filter the vocabulary list based on the search query
  const filteredVocabList = vocabList.filter((entry) => {
  const query = (searchQuery || "").toLowerCase();
    return (
      (entry.word && entry.word.toLowerCase().includes(query)) ||
      (entry.kana && entry.kana.toLowerCase().includes(query)) ||
      (entry.romaji && entry.romaji.toLowerCase().includes(query)) ||
      (entry.meanings && entry.meanings.some(m => m.toLowerCase().includes(query)))
    );
  });

  // Function for deleting a word from the vocabulary notebook
  const deleteVocabEntry = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this word?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("vocab").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete word.");
      console.error(error.message);
    } else {
      toast.success("Word deleted!");
      fetchVocabList(); // Refresh the vocabulary list
    }
  };

  // Flip Card Toggle Handler
  const toggleCardFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchVocabList();
  }, []);

  return (
    <main className="font-sans" 
          style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header Section */}
      <section
        className="shadow p-4 mt-4"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <h1 className="text-2xl font-bold mb-4">Vocab Notebook</h1>
      </section>

      {/* Word Input Section*/}
      <section
        className="shadow p-4 mt-4"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <WordInput 
          word={word} 
          setWord={setWord} 
          setSentence={setSentence} 
          setTranslation={setTranslation}
          setRomaji={setRomaji}
          loading={loading}
          setLoading={setLoading}
          definition={definition}
          setDefinition={setDefinition}
          setKanaWords={setKanaWords}
          setRomajiWords={setRomajiWords}
          
        />
      </section>

      {/* Sentence Generation Section */}
      <section
        className="shadow p-4 mt-4"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <div className="flex items-center gap-2 mt-4">
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
          
        <h2 className="text-xl font-semibold mb-2">Generated Sentence</h2>
        {loading ? (
          <p
            style={{ background: "var(--clickable-bg)", color: "var(--foreground-secondary)" }}
            className="italic"
          >
            Generating sentence...
          </p>
        ) : sentence ? (
          <>
            {kanaWords.length > 0 && romajiWords.length > 0 ? (
              <ClickableSentence
                kanaWords={kanaWords}
                romajiWords={romajiWords}
                onWordClick={handleWordClick}
                showRomaji={showRomaji}
              />
            ) : (
              <p className="mb-2">{sentence}</p>
            )}

            {translation && (
              <>
                <h3 className="text-lg font-medium mt-2">English Translation</h3>
                <p>{translation}</p>
              </>
            )}
          </>
        ) : (
          <p>Enter a word to generate a sentence.</p>
        )}
      </section>

      {/* Definition Section */}
      {definition && (
        <section
          className="shadow p-4 mt-4"
          style={{ background: "var(--background)", color: "var(--foreground)" }}
        >
          <h2 className="text-xl font-semibold mb-2">Definition</h2>
          
          {loading ? (
            <p
              style={{ color: "var(--foreground-secondary)" }}
              className="italic"
            >
              Loading definition...
            </p>
          ) : definition ? (
            <>
              <p><strong>Word:</strong> {definition.word}</p>
              <p><strong>Reading:</strong> {definition.reading}</p>
              <p><strong>Meaning(s):</strong></p>
              <ul className="list-disc list-inside ml-4">
                {Array.isArray(definition.meanings) ? (
                  definition.meanings.map((meaning, index) => (
                    <li key={index}>{meaning}</li>
                  ))
                ) : (
                  <li>No meanings found.</li>
                )}
              </ul>

              {/* Add to Notebook button */}
              {!vocabList.some(v => v.word === definition.word) && (
                <button
                  onClick={() => saveWordToNotebook(definition.word)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Add to Notebook
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-600">Click a word to see its definition.</p>
          )}
        </section>
      )}

      {/* Vocabulary Notebook Section */}
      <section
        className="shadow-md p-4 mt-4"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <h2 className="text-xl font-semibold mb-2">Vocabulary Notebook</h2>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by kanji, kana, romaji, or meaning..."
            className="w-full sm:w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            style={{ background: "var(--input-bg)", color: "var(--foreground)" }}
          />
        </div>

        {/* View Mode and Edit Mode Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded transition-colors duration-300 hover:bg-[var(--button-hover)] ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white hover:text-gray-800'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
            }`}
          >
            Grid View
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded transition-colors duration-300 hover:bg-[var(--button-hover)] ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white hover:text-gray-800' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
            }`}
          >
            List View
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded transition-colors duration-300 hover:bg-[var(--button-hover)] ${
              editMode
                ? 'bg-red-600 text-white hover:bg-red-700 hover:text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100  hover:bg-red-700 hover:text-white'
            }`}
          >
            {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          </button>
        </div>

        <p className="text-xs">Click to flip</p>

        {/* Conditional rendering for message OR list */}
        {vocabList.length === 0 ? (
          <p className="text-gray-600">Your notebook is empty. Click words in the sentence above to add them!</p>
        ) : (
          filteredVocabList.length > 0 ? (
            <ul className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                : "flex flex-col gap-4"
            }>
          {/* Render vocabulary entries */}
            {filteredVocabList.map((entry) => (
              <li
                key={entry.id}
                onClick={() => toggleCardFlip(entry.id)}
                className="
                  perspective
                  cursor-pointer
                  w-full
                  h-80
                  flex
                  items-center
                  justify-center
                "
              >
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVocabEntry(entry.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded z-10"
                    title="Delete word"
                  >
                    🗑️
                  </button>
                )}
                <div
                  className={`
                    relative w-full h-full
                    transform-style-preserve-3d
                    ${flippedCards[entry.id] ? 'flip-horizontal-top' : 'flip-horizontal-bottom'}
                  `}
                  style={{ background: "var(--card-bg)" }}
                >
                  {/* Front */}
                  <div 
                    className="
                      absolute
                      inset-0
                      backface-hidden
                      flex
                      flex-col
                      items-center
                      justify-center
                      p-4
                      border
                      rounded-lg
                      shadow-sm
                      text-center
                    "
                    style={{ background: "var(--card-bg)" }}
                  >
                    <p className="font-bold text-2xl">{entry.word}</p>
                  </div>

                  {/* Back */}
                  <div
                    className="
                      absolute
                      inset-0
                      backface-hidden
                      rotate-y-180
                      flex
                      flex-col
                      items-center
                      justify-center
                      p-4
                      border
                      rounded-lg
                      shadow-sm
                      text-center
                    "
                    style={{ background: "var(--card-bg)", transform: 'rotateX(180deg)' }}
                  >
                    <p className="font-semibold text-lg">{entry.word}</p>
                    <p className="text-sm">Kana: {entry.kana}</p>
                    <p className="text-sm">Romaji: {entry.romaji}</p>
                    <p className="text-sm">Meanings:</p>
                    <ul className="text-sm list-disc list-inside">
                      {entry.meanings && entry.meanings.length > 0 ? (
                        entry.meanings.map((meaning, index) => (
                          <li key={index}>{meaning}</li>
                        ))
                      ) : (
                        <li>No definition saved.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            searchQuery ? (
              <p className="text-gray-600">No results found for &quot;{searchQuery}&quot;.</p>
            ) : (
              null 
            )
          )
        )}
      </section>

    </main>
  );
};
