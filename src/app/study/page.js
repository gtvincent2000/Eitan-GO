'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import confetti from 'canvas-confetti';

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
            const { data, error } = await supabase
                .from('vocab')
                .select('*')
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
    }, [sessionComplete]);



    return (
        <main className="min-h-screen p-6" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            <h1 className="text-2xl font-bold mb-4">Study Mode - Eitan-GO</h1>

            {loading ? (
                <p style={{ color: "var(--foreground-secondary)" }}>Loading your vocabulary...</p>
            ) : (
                <div className="flex flex-col gap-4">

                    {/* Placeholder: Display vocab count */}
                    <p className="mt-4 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                        You have {vocabList.length} words saved for study.
                    </p>

                    {/* Mode selection panel */}
                    {studyMode === null && (
                        <div className="flex flex-wrap gap-2 items-center justify-center mt-4">
                            <button
                                onClick={() => setStudyMode('flashcard')}
                                className="
                                px-4 py-2 rounded transition-colors duration-300
                                bg-blue-600 text-white hover:bg-blue-700
                                "
                            >
                                Flashcard Mode
                            </button>
                            <button
                                onClick={() => setStudyMode('quiz')}
                                className="
                                    px-4 py-2 rounded transition-colors duration-300
                                bg-green-600 text-white hover:bg-green-700
                                "
                            >
                                Quiz Mode
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
                                    ${showAnswer ? 'rotate-y-180' : ''}
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
                                        absolute inset-0
                                        backface-hidden rotate-y-180
                                        flex flex-col justify-center items-center gap-2
                                        rounded shadow
                                        p-4
                                        text-center
                                    "
                                    style={{ background: "var(--card-bg)", color: "var(--foreground)" }}
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
                                    {/* Placeholder Content */}
                                    <h2 className="text-2xl font-bold mb-4">Quiz Mode</h2>
                                    <p className="text-center mb-4">Prepare to test your vocabulary knowledge!</p>
                                    <button
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                        onClick={() => {
                                            const generatedQuestions = generateQuizQuestions(vocabList, 10);
                                            setQuizQuestions(generatedQuestions);
                                            setCurrentQuizIndex(0);
                                            setScore(0);
                                            setQuizStarted(true);
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
function generateQuizQuestions(vocabList, count) {
  const questions = [];
  const usedIndices = new Set();

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  while (questions.length < count && usedIndices.size < vocabList.length) {
    const index = Math.floor(Math.random() * vocabList.length);
    if (usedIndices.has(index)) continue;

    usedIndices.add(index);
    const entry = vocabList[index];

    const questionType = getRandom([
      "kanjiToMeaning",
      "meaningToKanji",
      "kanjiToKana",
      "kanaToKanji"
    ]);

    let prompt = "";
    let correctAnswer = "";
    let choices = [];

    if (questionType === "kanjiToMeaning") {
      prompt = `What is the meaning of ${entry.word} (${entry.kana})?`;
      correctAnswer = getRandom(entry.meanings);
      choices = [correctAnswer];
      while (choices.length < 4) {
        const distractorEntry = getRandom(vocabList);
        const distractorMeaning = getRandom(distractorEntry.meanings);
        if (!choices.includes(distractorMeaning)) {
          choices.push(distractorMeaning);
        }
      }
    } else if (questionType === "meaningToKanji") {
      const meaning = getRandom(entry.meanings);
      prompt = `Which kanji represents "${meaning}"?`;
      correctAnswer = `${entry.word} (${entry.kana})`;
      choices = [correctAnswer];
      while (choices.length < 4) {
        const distractorEntry = getRandom(vocabList);
        const distractor = `${distractorEntry.word} (${distractorEntry.kana})`;
        if (!choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    } else if (questionType === "kanjiToKana") {
      prompt = `What is the reading of ${entry.word}?`;
      correctAnswer = entry.kana;
      choices = [correctAnswer];
      while (choices.length < 4) {
        const distractorEntry = getRandom(vocabList);
        const distractor = distractorEntry.kana;
        if (!choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    } else if (questionType === "kanaToKanji") {
      prompt = `Which kanji corresponds to "${entry.kana}"?`;
      correctAnswer = entry.word;
      choices = [correctAnswer];
      while (choices.length < 4) {
        const distractorEntry = getRandom(vocabList);
        const distractor = distractorEntry.word;
        if (!choices.includes(distractor)) {
          choices.push(distractor);
        }
      }
    }

    // Shuffle choices:
    choices = choices.sort(() => Math.random() - 0.5);

    questions.push({
      prompt,
      choices,
      correctAnswer,
      type: questionType
    });

    console.log("Generated quiz questions:", questions);
  }

  return questions;
  
}
