'use client';
import { useState, useEffect } from 'react';
import WordInput from '../components/WordInput';
import { toRomaji } from 'wanakana';
import ClickableSentence from '../components/ClickableSentence';
import { supabase } from '../lib/supabaseClient';
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
      setDefinition(data);
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
      // Fetch definition with reading
      const res = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const data = await res.json();

      if (!data.meanings || data.meanings.length === 0) {
        toast.error("No meanings found for this word.", { id: toastId });
        return;
      }

      // Use fetched kana reading and romaji
      const kana = data.reading || "";
      const romaji = kana ? wanakana.toRomaji(kana) : "";

      // Check for existing entry
      const { data: existing, error: fetchError } = await supabase
        .from("vocab")
        .select("*")
        .eq("word", data.word) // use returned kanji word for consistency
        .maybeSingle();

      if (fetchError) {
        toast.error("Error checking notebook.", { id: toastId });
        console.error(fetchError.message);
        return;
      }

      if (existing) {
        toast.error(`"${data.word}" is already in your notebook!`, { id: toastId });
        return;
      }

      // Insert into Supabase
      const { error } = await supabase.from("vocab").insert([
        {
          word: data.word, // kanji word
          kana,
          romaji,
          meanings: data.meanings,
        },
      ]);

      if (error) {
        toast.error("Failed to save word.", { id: toastId });
        console.error(error.message);
      } else {
        toast.success("Word saved to notebook!", { id: toastId });
        fetchVocabList(); // Refresh notebook
      }
    } catch (error) {
      console.error("Error saving word with meanings:", error);
      toast.error("Failed to save word.", { id: toastId });
    }
  };

  // Function to fetch the vocabulary list from Supabase
  const fetchVocabList = async () => {
    const { data, error } = await supabase
      .from("vocab")
      .select("*")
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
    const query = searchQuery.toLowerCase();
    return (
      entry.word.toLowerCase().includes(query) ||
      entry.kana.toLowerCase().includes(query) ||
      entry.romaji.toLowerCase().includes(query) ||
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
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Eitan-GO - 英単語ノート</h1>
      </section>

      {/* Word Input Section*/}
      <section>
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
      <section className="mt-6 p-4 bg-white rounded shadow">
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="romaji-toggle" className="text-sm font-medium text-gray-700">
             Show Romaji
          </label>
          <button
            id="romaji-toggle"
            onClick={() => setShowRomaji(!showRomaji)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              showRomaji ? 'bg-blue-500' : 'bg-gray-300'
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
          <p className="text-gray-500 italic">Generating sentence...</p>
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
        <section className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Definition</h2>
          
          {loading ? (
            <p className="italic text-gray-500">Loading definition...</p>
          ) : definition ? (
            <>
              <p><strong>Word:</strong> {definition.word}</p>
              <p><strong>Reading:</strong> {definition.reading}</p>
              <p><strong>Meaning(s):</strong></p>
              <ul className="list-disc list-inside ml-4">
                {definition.meanings.map((meaning, index) => (
                  <li key={index}>{meaning}</li>
                ))}
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
      <section className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Vocabulary Notebook</h2>
        <p className="text-xs text-gray-500">Click to flip</p>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by kanji, kana, romaji, or meaning..."
            className="w-full sm:w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded ${editMode ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            {editMode ? 'Exit Edit Mode' : 'Edit Notebook'}
          </button>
        </div>

        {/* Conditional rendering for message OR list */}
        {vocabList.length === 0 ? (
          <p className="text-gray-600">Your notebook is empty. Click words in the sentence above to add them!</p>
        ) : filteredVocabList.length === 0 ? (
          <p className="text-gray-600">No results found for "{searchQuery}".</p>
        ) : (
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
                  h-48
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
                    relative
                    w-full
                    h-full
                    transition-transform
                    duration-500
                    transform
                    transform-style-preserve-3d
                    ${flippedCards[entry.id] ? 'rotate-y-180' : ''}
                  `}
                >
                  {/* Front */}
                  <div className="
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
                    bg-white
                    text-center
                  ">
                    <p className="font-bold text-2xl">{entry.word}</p>
                  </div>

                  {/* Back */}
                  <div className="
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
                    bg-white
                    text-center
                  ">
                    <p className="font-semibold text-lg">{entry.word}</p>
                    <p className="text-sm text-gray-600">Kana: {entry.kana}</p>
                    <p className="text-sm text-gray-600">Romaji: {entry.romaji}</p>
                    <p className="text-sm text-gray-600">Meanings:</p>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
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
        )}
      </section>

    </main>
  );
};
