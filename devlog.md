Devlog for Eitan-GO by Gary Vincent

Friday June 20th 2025:
    What I Worked On: Today I installed Node and Tailwind and pushed the initial project shell to the git repository. I then built the WordInput function, learned how to use lift state in React, rendered dynamic content using useState and ternary logic.

    What I Struggled With: I forgot to pass a prop and got a runtime error. Troubleshooting this helped me understand how state and props connect beweeen components. 

    What I Learned: I learned lots today, as it was the first time setting up a react project. Some highlights include an introduction to Tailwind styling, reinforsing JSX incertion syntax, and state and prop connectivity.

    What's Next: Tomorrow I plan to integrate OpenAI API to generate example sentences based on user input.

Saturday June 21st 2025:
    What I Worked On: Today I built and integrated a new /api/define route using the Jisho.org API to fetch word definitions. I walked through the route setup step-by-step, including input validation, error handling, and parsing nested JSON.
                      On the frontend, I updated the handleSubmit function to fetch both the generated sentence and definition in parallel, added new state for storing the definition, and rendered the results with the word, reading, and meanings displayed clearly below the sentence.

    What I Struggled With: I initially had trouble seeing console logs for the definition due to some confusion between the VS Code terminal and browser console. I also had to revisit how await and async interact to avoid racing ahead of data.
                           Minor bugs like unused props and state not updating immediately helped reinforce good debugging practices.

    What I Learned: I learned how to build a complete API route in Next.js from scratch and how to work with third-party APIs like Jisho. I also deepened my understanding of parsing JSON, using conditional rendering in React, and passing state between components.
                    Finally, I gained experience in chaining multiple backend requests within a single submit flow while maintaining clean UX.

    What's Next: Next, I’ll implement a toggle that displays romaji above the kana for beginner users. After that, I plan to tokenize generated sentences so individual words can be clicked to view definitions or add them to the notebook.
                       These steps will help bring the Vocabulary Notebook feature closer to completion.

Sunday June 22nd 2025:
    What I Worked on Today: Today I implemented a working romaji output feature for generated Japanese sentences. I moved the formatting logic server-side using the kuromoji tokenizer to avoid browser issues, and built a formatter to improve readability.
                            I also added a toggle that lets users show or hide romaji on demand.

    What I Struggled With: The biggest challenge was diagnosing why romaji wasn’t rendering. It turned out to be an environment issue where Node-only code was mistakenly running in the browser.
                           Once that was resolved, I also had to clean up and debug prop passing and state updates to get the toggle and display working properly.

    What I Learned: I learned how to isolate API errors using try/catch and logs, how to offload heavy processing to the server, and how kuromoji breaks Japanese into tokenized parts for analysis.
                    I also got better at managing React props, async calls, and structuring conditionals for dynamic output.

    What's Next: Next, I plan to clean up the code a bit and then move on to refining sentence formatting even further — possibly by making generated words clickable to view definitions or add them to the notebook.
                 I may also revisit how definitions are displayed to improve UX.

Wednesday June 26th 2025:
    What I Worked On: Over the past few days I changed the sentence generation to include kanji and furigana. During this process I overhauled the romaji generation and added a loading spinner for the sentence generation.
                      I also made words within the sentence clickable and connected the vocabulary notebook to supabase.

    What I Struggled With: I struggled a little with the transition to having furigana above the kanji. Having to restructure existing code was more challenging than implementing entirely new code.
                           I ran into logic errors sometimes in places where I forgot to delete unneccessary code.

    What I Learned: I learned more about the APIs and about Supabase. I learned the importance of having easily readable code with comments to make it easier to go back and make changes later.

    What's Next: In the coming days I will make a display for words added to the vocab notebook and overhaul the styling to make it more aesthetic and user friendly. I will then add a search / filter feature for saved words. 

Wednesday July 3rd 2025:
    What I Worked On: 
        Over the last week I:
        - Added the display for saved words in the Vocabulary Notebook, including card flipping for meanings.
        - Updated Supabase integration to store definitions, manage RLS policies, and handle duplicate checks cleanly.
        - Created a navbar with a dropdown-based dark mode toggle.
        - Implemented full dark mode support across the Vocabulary Notebook page, including cards, input fields, loaders, clickable sentences, and hover states.

    What I Struggled With: The most challenging part of the last week of development was learning and implementing global CSS variable theming with Tailwind, ensuring conditional styling worked without conflicts,
                           and maintaining consistency across interactive components while preserving dark mode responsiveness.

    What I Learned:
        - How to implement global and conditional theming using CSS variables and Tailwind.
        - How to debug and structure a consistent dark mode system in a scalable Next.js project.
        - How to maintain consistent UI/UX while restructuring component styling.

    What's Next: Next, I will move on to developing the Study Mode feature for Eitan-GO, enabling users to review and test themselves on saved vocabulary interactively.

Friday July 11th 2025:
    What I Worked On:
        Over the last week I:
        - Added a fully functional quiz mode and flashcard review mode to the study page, including a progress bar and completion popup
        - Implemented randomized multi-type multiple-choice quizzes
        - Added audio feedback for correct and incorrect answers in quiz mode
    
    What I Struggled With: The most challenging part of the last week of development was correctly implementing the conditional rendering of the different study modes and maintaining consistent styling across the entire application.

    What I Learned:
        - Advanced conditional rendering in React using structured patterns for clean, scalable feature additions.
        - How to build reusable UI structures that respect consistent global theming and dark mode.
        - Structured state management for quizzes, including managing randomized question generation and immediate feedback.
        - Implementing gamified user feedback, including confetti scaling with performance and audio cues for correct/incorrect answers.

    What's Next: I will either begin building the Home Page to create a clean landing for Eitan-GO or begin the Translation Page to implement the AI-powered parsing and translation feature.
                 After adding one of these pages, I will focus on fine-tuning and testing the Vocabulary Notebook, Flashcard Mode, and Quiz Mode to ensure everything is polished, consistent, and bug-free before moving forward.

Saturday July 19th 2025:
    What I Worked On:
        Over the last week I:
        - Added a fully functional translation page that detects the user input as either English or Japanese and makes an OpenAI API call to handle the translation.
        - Implemented a definition dropdown on the Japanese translation, with the ability for the user to add clicked words to their vocabulary notebook.
        - Revamped the styling for various features such as light mode and buttons.
        - Overhauled and further gamified the UI on the study page.
        
    What I Struggled With: The most challenging part of the last week was perfecting the system prompt for the OpenAI API call for the translation. Other than that, there were some minor conflicts with styling.

    What I learned:
        - How to break React features into clean and reusable components.
        - How to implement advanced animations using custom keyframes and Framer Motion to enhance interactivity.
        - Enhanced use of OpenAI’s API by refining prompt engineering for precise segmentation and translation behavior, and integrating real-time Supabase updates for saving vocab.
        - Developed a stronger eye for production-ready UI such as layered backgrounds, subtle shadows, typography spacing, and accessible interactive elements.

