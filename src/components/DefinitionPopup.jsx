import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function DefinitionPopup({ word, definition, onClose, position, onSave }) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  if (!position) return null;

  return (
    <AnimatePresence>
      {word && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 w-64 bg-[var(--dropdown-bg)] text-sm shadow-xl rounded border"
          style={{
            top: position.top,
            left: position.left,
            position: "absolute",
            color: "var(--foreground)",
          }}
        >
          {/* Arrow styling */}
          <div className="absolute -top-2 left-4 w-3 h-3 bg-[var(--dropdown-bg)] border-l border-t border-[var(--border-color)] rotate-45" />

          <div className="p-3 pt-4">
            <p className="font-bold mb-1">{definition?.word || word}</p>
            <p className="italic text-sm text-gray-500 mb-2">{definition?.reading}</p>
            <ul className="list-disc list-inside mb-2">
              {(definition?.meanings || ["Loading..."]).map((meaning, i) => (
                <li key={i}>{meaning}</li>
              ))}
            </ul>
            <button
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={async () => {
                const result = await onSave(definition);

                if (result?.success) {
                  toast.success(`Added "${definition.word}" to your notebook!`);
                  onClose();
                } else if (result?.alreadyExists) {
                  toast("Already saved to notebook.");
                  onClose();
                } else {
                  toast.error("Failed to save word.");
                }
              }}
            >
              Add to Notebook
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}