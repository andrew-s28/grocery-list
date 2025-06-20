import { useState } from "react";

interface AddItemFormProps {
  onAddItem: (text: string) => void;
  disabled?: boolean;
}

export function AddItemForm({ onAddItem, disabled = false }: AddItemFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddItem(text.trim());
      setText("");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex sm:flex-row flex-col gap-3 mb-6 p-4 bg-primary-200 dark:bg-primary-200-dark rounded-lg border border-border dark:border-border-dark"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a grocery item..."
        className="flex-1 px-4 py-3 border border-border dark:border-border-dark rounded-md text-base transition-colors duration-200 bg-primary-100 dark:bg-primary-100-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:border-button-primary dark:focus:border-button-primary-dark focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)] dark:focus:shadow-[0_0_0_2px_rgba(13,110,253,0.25)] disabled:bg-primary-300 dark:disabled:bg-primary-300-dark disabled:opacity-60"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="px-6 py-3 bg-button-primary dark:bg-button-primary-dark text-white border-0 rounded-md text-base cursor-pointer transition-colors duration-200 min-w-[80px] hover:bg-button-primary-hover dark:hover:bg-button-primary-hover-dark disabled:bg-button-secondary dark:disabled:bg-button-secondary-dark disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}
