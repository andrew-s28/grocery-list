import { CircleX } from "lucide-react";
import type { GroceryItem } from "../types";

interface GroceryItemProps {
  item: GroceryItem;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export function GroceryItemComponent({
  item,
  onToggle,
  onRemove,
}: GroceryItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 my-2 bg-primary-100 dark:bg-primary-100-dark border border-border dark:border-border-dark rounded-lg transition-all duration-200 hover:border-border-light dark:hover:border-border-light-dark hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${
        item.completed
          ? "bg-primary-200 dark:bg-primary-200-dark opacity-70"
          : ""
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          className="w-[18px] h-[18px] cursor-pointer"
        />
        <span
          className={`text-base transition-all duration-200 text-text-primary dark:text-text-primary-dark ${
            item.completed
              ? "line-through text-text-muted dark:text-text-muted-dark"
              : ""
          }`}
        >
          {item.text}
        </span>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="bg-button-danger dark:bg-button-danger-dark text-white border-0 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-base leading-none transition-colors duration-200 hover:bg-button-danger-hover dark:hover:bg-button-danger-hover-dark"
        aria-label="Remove item"
      >
        <CircleX className="w-full h-full" />
      </button>
    </div>
  );
}
