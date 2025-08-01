'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function StudyPage() {

    // State variables
    const [vocabList, setVocabList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [studyMode, setStudyMode] = useState(null);
    const [shuffledVocabList, setShuffledVocabList] = useState([]);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [shake, setShake] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // "correct" | "incorrect"

    // Calculate Flashcard progress percentage
    const progress = ((currentIndex + 1) / vocabList.length) * 100;

    // Calculate Quiz progress percentage
    const percentage = Math.round((score / quizQuestions.length) * 100);

    // Track current question in quiz mode
    const currentQuestion = quizQuestions[currentQuizIndex];

    // Sounds for feedback
    const playCorrectSound = () => {
        const audio = new Audio('/sounds/correct.mp3');
        audio.play();
    };

    const playIncorrectSound = () => {
        const audio = new Audio('/sounds/incorrect.mp3');
        audio.play();
    };


    // Fetch vocabulary data from Supabase
    useEffect(() => {
        const fetchVocab = async () => {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.warn("User not signed in");
                toast.error("Please sign in to access your study materials.");
                setVocabList([]); // Clear vocab list if not signed in
                setLoading(false);
                return;
            }

            const userId = user.id;

            const { data, error } = await supabase
                .from('vocab')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching vocabulary:', error.message);
            } else {
                setVocabList(data);
            }

            setLoading(false);
        };

        fetchVocab();
    }, []);

    // Shuffle vocabulary list when it changes
    useEffect(() => {
        if (studyMode === 'flashcard' && vocabList.length > 0) {
            // Create a copy to shuffle, retain original's integrity
            const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
            setShuffledVocabList(shuffled);
            setCurrentIndex(0);
            setShowAnswer(false);
        }
    }, [studyMode, vocabList]);

    // Effect for Flashcard session complete
    useEffect(() => {
        if (sessionComplete) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 700);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
            });
            // Reset state after a delay
            return () => clearTimeout(timer);
        }
    }, [sessionComplete]);

    // Effect for Quiz session complete
    useEffect(() => {
        if (sessionComplete) {
            const particleCount =
                percentage >= 80 ? 200 :
                percentage >= 50 ? 100 :
                30;
            confetti({
                particleCount,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [sessionComplete, percentage]);


    return (
        <main className="min-h-screen p-6 font-sans" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            <h1 className="text-2xl font-bold mb-4">Study</h1>

            {loading ? (
                <p style={{ color: "var(--foreground-secondary)" }}>Loading your vocabulary...</p>
            ) : (
                <div className="flex flex-col gap-4">

                    {studyMode === null && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4 text-center mt-4 mb-6">
                            <div className="bg-[var(--card-bg)] rounded p-4 shadow">
                            <p className="text-xl font-bold">📒 {vocabList.length}</p>
                            <p className="text-sm text-[var(--foreground-secondary)]">Words Saved</p>
                            </div>
                        </div>
                    )}

                    {/* Mode selection panel */}
                    {studyMode === null && (
                        <div className="flex flex-row items-center justify-center h-[70vh] gap-6">
                            <button
                                onClick={() => {
                                    if (!vocabList || vocabList.length < 3) {
                                                toast.error("You need at least 3 saved words to study flashcards!");
                                                return;
                                            }
                                    setStudyMode('flashcard');
                                }}
                                className="
                                  pulsate-fwd
                                  w-40 h-40
                                  flex flex-col justify-center items-center text-center
                                  text-xl font-bold
                                  rounded-xl shadow-lg
                                  bg-blue-600 text-white hover:bg-blue-700
                                  transition-transform duration-300 transform hover:scale-105
                                "
                                >
                                    <span>Flashcard</span>
                                    <span>Mode</span>
                            </button>
                            <button
                                onClick={() => setStudyMode('quiz')}
                                className="
                                  pulsate-fwd
                                  w-40 h-40
                                  flex flex-col justify-center items-center text-center
                                  text-xl font-bold
                                  rounded-xl shadow-lg
                                  bg-green-600 text-white hover:bg-green-700
                                  transition-transform duration-300 transform hover:scale-105
                                "
                                >
                                    <span>Quiz</span>
                                    <span>Mode</span>
                            </button>
                        </div>
                    )}


                    {studyMode === 'flashcard' && (
                        // Flashcard display
                        shuffledVocabList.length > 0 && (
                        <>
                            {/* Change mode button */}
                            <button
                                className="fixed top-16 right-4 px-3 py-1 rounded text-sm transition"
                                style={{ background: "var(--button-bg)", color: "var(--foreground)" }}
                                onClick={() => setStudyMode(null)}
                                >
                                Change Mode
                            </button>

                            {/* Progress bar */}
                            <p className="text-sm text-center" style={{ color: "var(--foreground-secondary)" }}>
                                Card {currentIndex + 1} of {shuffledVocabList.length}
                            </p>
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-2">
                                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Display Flashcard w/ Animation */}
                            <div
                                className="
                                    perspective
                                    max-w-sm sm:max-w-md md:max-w-lg w-full mx-auto
                                    h-80
                                    relative
                                "
                            >
                                <div
                                    className={`
                                    transition-transform duration-500 transform transform-style-preserve-3d w-full h-full
                                    ${showAnswer ? 'flip-horizontal-top' : 'flip-horizontal-bottom'}
                                    `}
                                >
                                    {/* Front Face */}
                                    <div
                                        className="
                                            absolute inset-0
                                            backface-hidden
                                            flex flex-col justify-center items-center gap-2
                                            rounded shadow
                                            p-4
                                            text-center
                                        "
                                        style={{ background: "var(--card-bg)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}
                                    >
                                        <p className="text-3xl font-bold">{shuffledVocabList[currentIndex].word}</p>
                                    </div>

                                    {/* Back Face */}
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
                                        style={{ background: "var(--card-bg)", color: "var(--foreground)", transform: "rotateX(180deg)" }}
                                    >
                                        <p className="text-xl font-bold">{shuffledVocabList[currentIndex].kana}</p>
                                        <p className="text-lg">{shuffledVocabList[currentIndex].romaji}</p>
                                        <ul className="text-sm list-disc list-inside">
                                            {shuffledVocabList[currentIndex].meanings && shuffledVocabList[currentIndex].meanings.length > 0 ? (
                                            shuffledVocabList[currentIndex].meanings.map((meaning, idx) => (
                                                <li key={idx}>{meaning}</li>
                                            ))
                                            ) : (
                                            <li>No meanings saved.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Session complete message */}
                            {sessionComplete && (
                                <div
                                    className="
                                    fixed inset-0 flex items-center justify-center
                                    bg-transparent
                                    "
                                    
                                >
                                    <div
                                    className={`rounded-lg p-6 shadow-lg text-center transform transition-transform duration-500 max-w-xs w-full ${shake ? 'animate-shake' : ''}`}
                                    style={{ backdropFilter: "blur(5px)", background: "var(--popup-bg)", color: "var(--popup-text)" }}
                                    >
                                    <p className="text-3xl mb-2">🎉</p>
                                    <h2 className="text-xl font-bold mb-2">Session Complete!</h2>
                                    <p className="mb-4">You reviewed {shuffledVocabList.length} words!</p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                        onClick={() => {
                                            setSessionComplete(false);
                                            setCurrentIndex(0);
                                            setShowAnswer(false);
                                        }}
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                                        >
                                        Restart Session
                                        </button>
                                        <button
                                        onClick={() => {
                                            setSessionComplete(false);
                                            setStudyMode(null);
                                        }}
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                        Return to Mode Selection
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            )}

                            {/* Show Answer and Next buttons here */}
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {/* Show answer button */}
                                <button
                                    className="
                                        px-4 py-2 rounded transition-colors duration-300
                                        bg-blue-800 text-white hover:bg-blue-900
                                    "
                                    onClick={() => setShowAnswer(!showAnswer)}
                                >
                                    {showAnswer ? 'Show Word' : 'Show Answer'}
                                </button>
                                {/* Next button */}
                                <button
                                    className="
                                        px-4 py-2 rounded transition-colors duration-300
                                        bg-green-800 text-white hover:bg-green-900
                                    "
                                    onClick={() => {
                                        if (currentIndex + 1 >= shuffledVocabList.length) {
                                            setSessionComplete(true);
                                        } else {
                                            setCurrentIndex(prev => prev + 1);
                                            setShowAnswer(false);
                                        }
                                    }}
                                >
                                    Next
                                </button>
                                {/* Previous button */}
                                { currentIndex > 0 && (
                                    <button
                                    className="
                                        px-4 py-2 rounded transition-colors duration-300
                                        bg-yellow-600 text-white hover:bg-yellow-700
                                    "
                                    onClick={() => {
                                        setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledVocabList.length) % shuffledVocabList.length);
                                        setShowAnswer(false);
                                   }}
                                    >
                                    Previous
                                    </button>
                                )}
                                {/* Restart button */}
                                {currentIndex !== 0 && (
                                    <button
                                        className="px-4 py-2 rounded transition-colors duration-300 bg-red-800 text-white hover:bg-red-900"
                                         onClick={() => {
                                        setCurrentIndex(0);
                                        setShowAnswer(false);
                                        }}
                                    >
                                        Restart
                                    </button>
                                )}
                            </div>

                        </>
                        )
                    )}

                    {studyMode === 'quiz' && (
                        <section className="relative flex flex-col items-center justify-center p-4">
                            {/* Change Mode Button */}
                            <button
                                className="fixed top-16 right-4 px-3 py-1 rounded text-sm transition"
                                style={{ background: "var(--button-bg)", color: "var(--foreground)" }}
                                onClick={() => setStudyMode(null)}
                            >
                                Change Mode
                            </button>

                            {quizStarted ? (
                                <>
                                    {/* Progress Indicator */}
                                    <p className="text-sm text-center mb-2" style={{ color: "var(--foreground-secondary)" }}>
                                        Question {currentQuizIndex + 1} of {quizQuestions.length}
                                    </p>
                                    {/* Progress Bar */}
                                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-4">
                                        <div
                                            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${(currentQuizIndex + 1) / quizQuestions.length * 100}%` }}
                                        ></div>
                                    </div>
                                    {/* Quiz Question Display */}
                                    <section className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
                                        {/* Prompt */}
                                        <h2 className="text-xl font-bold mb-4 text-center">
                                            {currentQuestion.prompt}
                                        </h2>

                                        {/* Choices */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                            {currentQuestion.choices.map((choice, index) => (
                                                <button
                                                    key={index}
                                                    disabled={selectedAnswer !== null}
                                                    className="px-4 py-2 rounded transition-colors duration-300 w-full"
                                                    style={{
                                                        background:
                                                            selectedAnswer === null
                                                                ? "var(--button-bg)"
                                                                : choice === currentQuestion.correctAnswer
                                                                    ? "var(--correct-bg)"
                                                                    : choice === selectedAnswer
                                                                        ? "var(--incorrect-bg)"
                                                                        : "var(--button-bg)",
                                                        color: "var(--button-text)",
                                                        cursor: selectedAnswer !== null ? "not-allowed" : "pointer",
                                                    }}
                                                    onClick={() => {
                                                        setSelectedAnswer(choice);
                                                        if (choice === currentQuestion.correctAnswer) {
                                                            setFeedback('correct');
                                                            setScore(prev => prev + 1);
                                                            playCorrectSound();
                                                        } else {
                                                            setFeedback('incorrect');
                                                            playIncorrectSound();
                                                        }
                                                    }}
                                                >
                                                    {choice}
                                                </button>
                                            ))}
                                        </div>

                                        

                                        {/* Feedback Message */}
                                        {feedback && (
                                            <p className={`mt-4 text-lg ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                                                {feedback.message}
                                            </p>
                                        )}

                                        {/* Next Button */}
                                        {selectedAnswer && (
                                            <button
                                                className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                                onClick={() => {
                                                    if (currentQuizIndex + 1 >= quizQuestions.length) {
                                                        setSessionComplete(true);
                                                        setQuizStarted(false);
                                                    } else {
                                                        setCurrentQuizIndex(prev => prev + 1);
                                                        setSelectedAnswer(null);
                                                        setFeedback(null);
                                                    }
                                                }}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </section>
                                </>
                            ) : (
                                <>
                                    {/* Quiz Mode Selection */}
                                    <h2 className="text-2xl font-bold mb-4">Quiz Mode</h2>
                                    <p className="text-center mb-4">Prepare to test your vocabulary knowledge!</p>
                                    <button
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                        onClick={() => {
                                            if (!vocabList || vocabList.length < 3) {
                                                toast.error("You need at least 3 saved words to start a quiz!");
                                                return;
                                            }
                                            const generatedQuestions = generateQuizQuestions(vocabList, 10);
                                            setQuizQuestions(generatedQuestions);
                                            setCurrentQuizIndex(0);
                                            setScore(0);
                                            setQuizStarted(true);
                                            console.log("Button clicked");
                                            console.log("Vocab List:", vocabList);
                                        }}
                                    >
                                        Start Quiz
                                    </button>
                                </>
                            )}
                            {/* Session Complete Message */}
                            {sessionComplete && (
                                <div
                                    className="
                                    fixed inset-0 flex items-center justify-center
                                    bg-transparent
                                    "
                                >
                                    <div
                                        className={`rounded-lg p-6 shadow-lg text-center transform transition-transform duration-500 max-w-xs w-full ${shake ? 'animate-shake' : ''}`}
                                        style={{ backdropFilter: "blur(5px)", background: "var(--popup-bg)", color: "var(--popup-text)" }}
                                    >
                                        <p className="text-3xl mb-2">🎉</p>
                                        <h2 className="text-xl font-bold mb-2">Quiz Complete!</h2>
                                        <p className="mb-2">Score: {score} / {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)</p>
                                        <p className="mb-4">
                                            {Math.round((score / quizQuestions.length) * 100) >= 80
                                                ? "Amazing work! 🌟"
                                                : Math.round((score / quizQuestions.length) * 100) >= 50
                                                    ? "Great job! Keep practicing 💪"
                                                    : "Good effort! Try again to improve 🚀"}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    const regenerated = generateQuizQuestions(vocabList, 10);
                                                    setQuizQuestions(regenerated);
                                                    setCurrentQuizIndex(0);
                                                    setScore(0);
                                                    setSelectedAnswer(null);
                                                    setFeedback(null);
                                                    setSessionComplete(false);
                                                    setQuizStarted(true);
                                                }}
                                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                                            >
                                                Retry Quiz
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSessionComplete(false);
                                                    setQuizStarted(false);
                                                    setStudyMode(null);
                                                }}
                                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                            >
                                                Return to Mode Selection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            )}
        </main>
    );
}

// Function to generate quiz questions
function generateQuizQuestions(vocabList, desiredCount) {
  const questions = [];
  const usedIndices = new Set();

  const getRandom = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr[Math.floor(Math.random() * arr.length)]
      : null;

  // Step 1: Filter only valid vocab entries
  const validVocab = vocabList.filter(
    (entry) =>
      entry.word &&
      entry.kana &&
      Array.isArray(entry.meanings) &&
      entry.meanings.length > 0
  );

  // Step 2: Determine safe question count
  const count = Math.min(desiredCount, validVocab.length);

  // Step 3: Prevent infinite loops
  let attempts = 0;
  const maxAttempts = 1000;

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;

    const index = Math.floor(Math.random() * validVocab.length);
    if (usedIndices.has(index)) continue;

    const entry = validVocab[index];
    usedIndices.add(index);
    if (!entry) continue;

    const questionType = getRandom([
      "kanjiToMeaning",
      "meaningToKanji",
      "kanjiToKana",
      "kanaToKanji",
    ]);

    let prompt = "";
    let correctAnswer = "";
    let choices = [];

    if (questionType === "kanjiToMeaning") {
      correctAnswer = getRandom(entry.meanings);
      prompt = `What is the meaning of ${entry.word} (${entry.kana})?`;
      choices = [correctAnswer];

      while (choices.length < 4 && choices.length < validVocab.length) {
        const distractorEntry = getRandom(validVocab);
        const distractor = getRandom(distractorEntry.meanings);
        if (distractor && !choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    } else if (questionType === "meaningToKanji") {
      const meaning = getRandom(entry.meanings);
      correctAnswer = `${entry.word} (${entry.kana})`;
      prompt = `Which kanji represents "${meaning}"?`;
      choices = [correctAnswer];

      while (choices.length < 4 && choices.length < validVocab.length) {
        const distractorEntry = getRandom(validVocab);
        const distractor = `${distractorEntry.word} (${distractorEntry.kana})`;
        if (distractor && !choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    } else if (questionType === "kanjiToKana") {
      correctAnswer = entry.kana;
      prompt = `What is the reading of ${entry.word}?`;
      choices = [correctAnswer];

      while (choices.length < 4 && choices.length < validVocab.length) {
        const distractor = getRandom(validVocab)?.kana;
        if (distractor && !choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    } else if (questionType === "kanaToKanji") {
      correctAnswer = entry.word;
      prompt = `Which kanji corresponds to "${entry.kana}"?`;
      choices = [correctAnswer];

      while (choices.length < 4 && choices.length < validVocab.length) {
        const distractor = getRandom(validVocab)?.word;
        if (distractor && !choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    }

    // Shuffle choices
    choices = choices.sort(() => Math.random() - 0.5);

    questions.push({
      prompt,
      choices,
      correctAnswer,
      type: questionType,
    });
  }

  if (attempts >= maxAttempts) {
    console.warn("Quiz generation stopped after hitting maxAttempts.");
  }

  return questions;
}

