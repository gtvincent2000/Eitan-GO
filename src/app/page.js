'use client';
import { useState } from 'react';
import WordInput from '../components/WordInput';
import { toRomaji } from 'wanakana';
import ClickableSentence from '../components/ClickableSentence';
import { supabase } from '../lib/supabaseClient';
import * as wanakana from 'wanakana';
import toast from 'react-hot-toast';


export default function Home() {
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [definition, setDefinition] = useState(null);
  const [showRomaji, setShowRomaji] = useState(false);
  const [romaji ,setRomaji] = useState("");
  const [clickedWord, setClickedWord] = useState("");
  const [kanaWords, setKanaWords] = useState([]);
  const [romajiWords, setRomajiWords] = useState([]);

  const handleWordClick = async (word) => {
    const confirmSave = confirm(`Add "${word}" to your vocabulary notebook?`);
    if (!confirmSave) return;

    const index = kanaWords.indexOf(word);
    const romaji = romajiWords[index] || "";
    const kana = wanakana.toHiragana(romaji);

    const toastId = toast.loading("Saving word...");

    const { error } = await supabase.from("vocab").insert([
      {
        word,
        kana,
        romaji,
      },
    ]);

    if (error) {
      toast.error("Failed to save word. Check console.", { id: toastId });
      console.error(error.message);
    } else {
      toast.success("Word saved to notebook!", { id: toastId });
    }
  };

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
          <p>
            <strong>Word:</strong> {definition.word}
          </p>
          <p>
            <strong>Reading:</strong> {definition.reading}
          </p>
          <p>
            <strong>Meaning(s):</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            {definition.meanings.map((meaning, index) => (
              <li key={index}>{meaning}</li>
            ))}
          </ul>
        </section>
      )}

    </main>
  );
}
