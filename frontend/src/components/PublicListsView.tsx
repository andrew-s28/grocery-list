import { useState, useEffect } from "react";
import type { GroceryList } from "../types";
import { GroceryAPI } from "../services/api";

interface PublicListsViewProps {
  currentUsername: string;
}

export function PublicListsView({ currentUsername }: PublicListsViewProps) {
  const [publicLists, setPublicLists] = useState<GroceryList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPublicLists();
  }, [currentUsername]);

  const loadPublicLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const lists = await GroceryAPI.getAllPublicLists();
      setPublicLists(lists);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load public lists"
      );
      console.error("Error loading public lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    setToggleLoading(itemId);
    setError(null);

    try {
      const updatedItem = await GroceryAPI.toggleItem(listId, itemId);

      // Update the local state with the toggled item
      setPublicLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? updatedItem : item
                ),
              }
            : list
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      console.error("Error toggling item:", err);
    } finally {
      setToggleLoading(null);
    }
  };
  if (loading) {
    return (
      <div className="text-center py-10 text-text-secondary dark:text-text-secondary-dark text-lg">
        Loading public lists...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-bg dark:bg-error-bg-dark text-error-text dark:text-error-text-dark border border-error-border dark:border-error-border-dark rounded-md p-4 mb-6 flex justify-between items-center">
        <p>{error}</p>
        <button
          onClick={loadPublicLists}
          className="bg-button-danger dark:bg-button-danger-dark text-white border-0 rounded cursor-pointer px-3 py-1.5 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (publicLists.length === 0) {
    return (
      <div className="text-center py-10 text-text-secondary dark:text-text-secondary-dark">
        <h3 className="text-text-primary dark:text-text-primary-dark mb-4 font-bold">
          No Public Lists
        </h3>
        <p>No other users have created public grocery lists yet.</p>
        <p>Share your own public list to see it here!</p>
      </div>
    );
  }
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-text-primary dark:text-text-primary-dark mb-2 text-2xl font-bold">
        Public Lists
      </h2>
      <p className="text-text-secondary dark:text-text-secondary-dark mb-6 text-sm">
        Here are all the public grocery lists on the platform. Here you can view
        and check off items from any public list. If you want to create a new
        list or edit an existing one, please use the "Public Lists" tab instead.
      </p>
      {publicLists
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((list) => (
          <div
            key={list.id}
            className="bg-primary-200 dark:bg-primary-200-dark border border-border dark:border-border-dark rounded-lg mb-5 overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
          >
            <div className="bg-primary-100 dark:bg-primary-100-dark px-5 py-4 flex justify-between items-center border-b border-border dark:border-border-dark">
              <div>
                <h3 className="text-text-primary dark:text-text-primary-dark m-0 mb-1 text-lg font-bold">
                  {list.name}
                </h3>
                <p className="text-text-secondary dark:text-text-secondary-dark text-[13px] m-0 italic">
                  by {list.username}
                </p>
              </div>
              <span className="bg-button-primary dark:bg-button-primary-dark text-white px-2 py-1 rounded-xl text-xs font-medium">
                {list.items.length} item{list.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            {list.items.length === 0 ? (
              <div className="py-5 text-center text-text-secondary dark:text-text-secondary-dark">
                <p>This list is empty.</p>
              </div>
            ) : (
              <div className="px-5 py-4">
                {list.items
                  .sort((a, b) => {
                    // Show uncompleted items first
                    if (a.completed !== b.completed) {
                      return a.completed ? 1 : -1;
                    }
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-light-dark last:border-b-0 cursor-pointer transition-colors duration-200 hover:bg-primary-200 dark:hover:bg-primary-200-dark"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleItem(list.id, item.id)}
                          disabled={toggleLoading === item.id}
                          className="w-[18px] h-[18px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <span
                          className={`text-text-primary dark:text-text-primary-dark text-[15px] cursor-pointer transition-all duration-200 hover:text-button-primary dark:hover:text-button-primary-dark ${
                            item.completed
                              ? "line-through text-text-muted dark:text-text-muted-dark opacity-70"
                              : ""
                          }`}
                          onClick={() => handleToggleItem(list.id, item.id)}
                        >
                          {item.text}
                        </span>
                      </div>
                      {toggleLoading === item.id && (
                        <span className="text-button-primary dark:text-button-primary-dark text-base animate-spin">
                          ⟳
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {list.items.length > 0 && (
              <div className="px-5 py-3 bg-primary-300 dark:bg-primary-300-dark text-center text-text-secondary dark:text-text-secondary-dark text-[13px] border-t border-border dark:border-border-dark">
                {list.items.filter((item) => item.completed).length} of
                {list.items.length} completed
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
