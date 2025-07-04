import { useState, useEffect } from "react";
import type { GroceryList } from "../types";
import { GroceryAPI } from "../services/api";
import { CircleX } from "lucide-react";

interface ListManagerProps {
  username: string;
  isPublic: boolean;
  onSelectList: (list: GroceryList) => void;
  selectedListId?: string;
  refreshTrigger?: number; // Add refresh trigger
}

export function ListManager({
  username,
  isPublic,
  onSelectList,
  selectedListId,
  refreshTrigger,
}: ListManagerProps) {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadLists();
  }, [username, isPublic, refreshTrigger]);

  const loadLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const userLists = isPublic
        ? await GroceryAPI.getAllPublicLists()
        : await GroceryAPI.getListsForUser(username, false);
      // const userLists = await GroceryAPI.getAllPublicLists();
      setLists(userLists);

      // If no list is selected and we have lists, select the first one
      if (!selectedListId && userLists.length > 0) {
        onSelectList(userLists[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lists");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newList = await GroceryAPI.createList(
        username,
        newListName.trim(),
        isPublic
      );
      setLists((prev) => [...prev, newList]);
      onSelectList(newList);
      setNewListName("");
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this list? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await GroceryAPI.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));

      // If the deleted list was selected, select another one
      if (selectedListId === listId) {
        const remainingLists = lists.filter((list) => list.id !== listId);
        if (remainingLists.length > 0) {
          onSelectList(remainingLists[0]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list");
    }
  };
  if (loading && lists.length === 0) {
    return (
      <div className="text-center py-5 text-text-secondary dark:text-text-secondary-dark">
        Loading your lists...
      </div>
    );
  }
  return (
    <div className="bg-primary-200 dark:bg-primary-200-dark rounded-lg p-5 mb-6 border border-border dark:border-border-dark">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border dark:border-border-dark">
        <h3 className="m-0 text-text-primary dark:text-text-primary-dark text-lg font-bold">
          {isPublic ? "All Public Lists" : "My Private Lists"}
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-button-primary dark:bg-button-primary-dark text-white border-0 rounded-md px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-button-primary-hover dark:hover:bg-button-primary-hover-dark"
        >
          + New List
        </button>
      </div>
      {error && (
        <div className="bg-error-bg dark:bg-error-bg-dark text-error-text dark:text-error-text-dark border border-error-border dark:border-error-border-dark rounded-md p-3 mb-4 flex justify-between items-center">
          <p>{error}</p>
          <button
            onClick={loadLists}
            className="bg-button-danger dark:bg-button-danger-dark text-white border-0 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-base leading-none transition-colors duration-200 hover:bg-button-danger-hover dark:hover:bg-button-danger-hover-dark"
            aria-label="Remove item"
          >
            <CircleX className="w-full h-full" />
          </button>
        </div>
      )}
      {showCreateForm && (
        <form
          onSubmit={handleCreateList}
          className="bg-primary-100 dark:bg-primary-100-dark border border-border dark:border-border-dark rounded-md p-4 mb-4"
        >
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="w-full px-3 py-2 border border-border dark:border-border-dark rounded text-sm mb-3 bg-primary-100 dark:bg-primary-100-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:border-button-primary dark:focus:border-button-primary-dark focus:ring-2 focus:ring-[rgba(0,123,255,0.25)] dark:focus:ring-[rgba(13,110,253,0.25)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="px-3 py-1.5 border-0 rounded cursor-pointer text-sm font-medium bg-button-success dark:bg-button-success-dark text-white hover:bg-button-success-hover dark:hover:bg-button-success-hover-dark disabled:bg-button-secondary dark:disabled:bg-button-secondary-dark disabled:cursor-not-allowed"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewListName("");
              }}
              className="px-3 py-1.5 border-0 rounded cursor-pointer text-sm font-medium bg-button-secondary dark:bg-button-secondary-dark text-white hover:bg-button-secondary-hover dark:hover:bg-button-secondary-hover-dark"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="max-h-[300px] overflow-y-auto">
        {lists.length === 0 ? (
          <div className="text-center py-5 text-text-secondary dark:text-text-secondary-dark">
            {isPublic ? (
              <p>There are no {isPublic ? "public" : "private"} lists yet.</p>
            ) : (
              <p>You have no private lists yet.</p>
            )}
            <p>Create a list to get started!</p>
          </div>
        ) : (
          lists
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((list) => (
              <div
                key={list.id}
                className={`flex justify-between items-center bg-primary-100 dark:bg-primary-100-dark border border-border dark:border-border-dark rounded-md px-4 py-3 mb-2 cursor-pointer transition-all duration-200 hover:border-button-primary dark:hover:border-button-primary-dark hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${
                  selectedListId === list.id
                    ? "border-button-primary dark:border-button-primary-dark bg-primary-300 dark:bg-primary-300-dark shadow-[0_2px_4px_rgba(0,123,255,0.25)] dark:shadow-[0_2px_4px_rgba(13,110,253,0.25)]"
                    : ""
                }`}
                onClick={() => onSelectList(list)}
              >
                <div className="flex-1">
                  <h4 className="m-0 mb-1 text-text-primary dark:text-text-primary-dark text-[15px] font-medium">
                    {list.name}
                    <span className="text-[15px] text-text-secondary dark:text-text-secondary-dark italic">
                      &nbsp;(created by {list.username})
                    </span>
                  </h4>
                  <p className="m-0 text-text-secondary dark:text-text-secondary-dark text-[13px]">
                    {list.items.length}&nbsp;item
                    {list.items.length !== 1 ? "s" : ""}
                    &nbsp;•&nbsp;
                    {list.items.filter((item) => item.completed).length}
                    &nbsp;completed
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="bg-button-danger dark:bg-button-danger-dark text-white border-0 rounded-full min-w-6 w-6 h-6 flex items-center justify-center cursor-pointer text-base leading-none transition-colors duration-200 ml-3 hover:bg-button-danger-hover dark:hover:bg-button-danger-hover-dark"
                  aria-label="Delete list"
                >
                  <CircleX className="w-full h-full" />
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
