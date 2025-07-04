import { useState, useEffect } from "react";
import type { ListType, GroceryList } from "../types";
import { useGroceryListActions } from "../hooks/useGroceryListActions";
import { GroceryItemComponent } from "./GroceryItemComponent";
import { AddItemForm } from "./AddItemForm";
import { PublicListsView } from "./PublicListsView";
import { ListManager } from "./ListManager";
import DarkModeSwitch from "./DarkModeSwitch";
import { userStorage } from "../utils/cookies";

export function GroceryListApp() {
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState<ListType>("public");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentList, setCurrentList] = useState<GroceryList | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { loading, error, addItem, toggleItem, removeItem, clearCompleted } =
    useGroceryListActions(currentList); // Load saved username from storage on component mount
  useEffect(() => {
    const savedUsername = userStorage.get("grocery-app-username");
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Save username to storage
      userStorage.set("grocery-app-username", username.trim());
      setIsLoggedIn(true);
    }
  };
  const handleSwitchUser = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentList(null);
    // Remove username from storage
    userStorage.remove("grocery-app-username");
  };

  const handleSelectList = (list: GroceryList) => {
    setCurrentList(list);
  };
  const handleAddItem = async (text: string) => {
    if (!currentList) return;
    const newItem = await addItem(text);
    if (newItem) {
      // Update the current list with the new item
      setCurrentList((prev) =>
        prev
          ? {
              ...prev,
              items: [...prev.items, newItem],
            }
          : null
      );
      // Trigger refresh of list counts
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleToggleItem = async (itemId: string) => {
    if (!currentList) return;
    const updatedItem = await toggleItem(itemId);
    if (updatedItem) {
      // Update the current list with the toggled item
      setCurrentList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === itemId ? updatedItem : item
              ),
            }
          : null
      );
      // Trigger refresh of list counts
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!currentList) return;
    const success = await removeItem(itemId);
    if (success) {
      // Remove the item from the current list
      setCurrentList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.id !== itemId),
            }
          : null
      );
      // Trigger refresh of list counts
      setRefreshTrigger((prev) => prev + 1);
    }
  };
  const handleClearCompleted = async () => {
    if (!currentList) return;
    const success = await clearCompleted();
    if (success) {
      // Remove completed items from the current list
      setCurrentList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => !item.completed),
            }
          : null
      );
      // Trigger refresh of list counts
      setRefreshTrigger((prev) => prev + 1);
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto p-5 font-sans min-h-screen bg-primary-50 dark:bg-primary-50-dark">
        <div className="p-10 rounded-xl text-center mt-[100px] bg-primary-100 dark:bg-primary-100-dark shadow-[0_4px_6px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="m-0 text-[2.5rem] text-text-primary dark:text-text-primary-dark font-bold">
              Grocery List App
            </h1>
            <DarkModeSwitch />
          </div>
          <form onSubmit={handleLogin} className="max-w-3xl mx-auto">
            <div className="mb-5 text-left">
              <label
                htmlFor="username"
                className="block mb-2 font-medium text-text-secondary dark:text-text-secondary-dark"
              >
                Enter your username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-md text-base focus:outline-none focus:ring-2 border border-border dark:border-border-dark bg-primary-100 dark:bg-primary-100-dark text-text-primary dark:text-text-primary-dark focus:border-button-primary dark:focus:border-button-primary-dark focus:ring-[rgba(0,123,255,0.25)] dark:focus:ring-[rgba(13,110,253,0.25)]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white border-0 rounded-md text-base cursor-pointer transition-colors duration-200 bg-button-primary dark:bg-button-primary-dark hover:bg-button-primary-hover dark:hover:bg-button-primary-hover-dark"
            >
              Continue
            </button>
          </form>
          <p className="mt-4 text-sm text-text-secondary dark:text-text-secondary-dark">
            No password required - just enter any username to get started!
            {username && (
              <>
                <br />
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Welcome back! Your username was remembered.
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-5 font-sans min-h-screen bg-primary-50 dark:bg-primary-50-dark hyphens-auto">
      <header className="rounded-xl mb-6 overflow-hidden bg-primary-100 dark:bg-primary-100-dark shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sm:flex-row w-full gap-2 justify-between items-center px-8 py-6 border-b border-border-light dark:border-border-light-dark text-text-secondary dark:text-text-secondary-dark">
          <h1 className="m-0 text-3xl text-text-primary dark:text-text-primary-dark font-bold">
            Grocery Lists
          </h1>
          <h2 className="text-lg font-bold">Welcome, {username}!</h2>
          <div className="flex justify-around max-w-60 sm:justify-end gap-2">
            <DarkModeSwitch />
            <button
              onClick={handleSwitchUser}
              className="px-4 py-2 text-white border-0 rounded cursor-pointer text-sm transition-colors duration-200 bg-button-secondary dark:bg-button-secondary-dark hover:bg-button-secondary-hover dark:hover:bg-button-secondary-hover-dark"
            >
              Switch User
            </button>
          </div>
        </div>
        <div className="flex bg-primary-200 dark:bg-primary-200-dark">
          <button
            className={`flex-1 px-3 py-4 border-0 cursor-pointer text-[15px] font-medium transition-all duration-200 border-b-[3px] text-center ${
              activeTab === "public"
                ? "bg-primary-100 dark:bg-primary-100-dark text-button-primary dark:text-button-primary-dark border-b-button-primary dark:border-b-button-primary-dark"
                : "bg-transparent text-text-secondary dark:text-text-secondary-dark hover:bg-primary-300 dark:hover:bg-primary-300-dark hover:text-text-primary dark:hover:text-text-primary-dark border-b-transparent"
            }`}
            onClick={() => {
              setActiveTab("public");
              setCurrentList(null);
            }}
          >
            Public Lists
          </button>
          <button
            className={`flex-1 px-3 py-4 border-0 cursor-pointer text-[15px] font-medium transition-all duration-200 border-b-[3px] text-center ${
              activeTab === "private"
                ? "bg-primary-100 dark:bg-primary-100-dark text-button-primary dark:text-button-primary-dark border-b-button-primary dark:border-b-button-primary-dark"
                : "bg-transparent text-text-secondary dark:text-text-secondary-dark hover:bg-primary-300 dark:hover:bg-primary-300-dark hover:text-text-primary dark:hover:text-text-primary-dark border-b-transparent"
            }`}
            onClick={() => {
              setActiveTab("private");
              setCurrentList(null);
            }}
          >
            Private Lists
          </button>
          <button
            className={`flex-1 px-3 py-4 border-0 cursor-pointer text-[15px] font-medium transition-all duration-200 border-b-[3px] text-center ${
              activeTab === "explore"
                ? "bg-primary-100 dark:bg-primary-100-dark text-button-primary dark:text-button-primary-dark border-b-button-primary dark:border-b-button-primary-dark"
                : "bg-transparent text-text-secondary dark:text-text-secondary-dark hover:bg-primary-300 dark:hover:bg-primary-300-dark hover:text-text-primary dark:hover:text-text-primary-dark border-b-transparent"
            }`}
            onClick={() => {
              setActiveTab("explore");
              setCurrentList(null);
            }}
          >
            Explore Lists
          </button>
        </div>
      </header>
      <main className="rounded-xl p-8 bg-primary-100 dark:bg-primary-100-dark shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        {error && (
          <div className="rounded-md p-4 mb-6 flex justify-between items-center bg-error-bg dark:bg-error-bg-dark text-error-text dark:text-error-text-dark border border-error-border dark:border-error-border-dark">
            <p>{error}</p>
          </div>
        )}

        {activeTab === "explore" ? (
          <PublicListsView currentUsername={username} />
        ) : (
          <>
            <ListManager
              username={username}
              isPublic={activeTab === "public"}
              onSelectList={handleSelectList}
              selectedListId={currentList?.id}
              refreshTrigger={refreshTrigger}
            />
            {currentList ? (
              <div className="max-w-xl mx-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light dark:border-border-light-dark">
                  <h2 className="m-0 text-2xl text-text-primary dark:text-text-primary-dark font-bold">
                    {currentList.name}
                  </h2>
                  {currentList.items.some((item) => item.completed) && (
                    <button
                      onClick={handleClearCompleted}
                      className="px-4 py-2 text-white border-0 rounded cursor-pointer text-sm transition-colors duration-200 bg-button-danger dark:bg-button-danger-dark hover:bg-button-danger-hover dark:hover:bg-button-danger-hover-dark"
                    >
                      Clear Completed
                    </button>
                  )}
                </div>
                <AddItemForm onAddItem={handleAddItem} disabled={loading} />
                <div className="mb-6">
                  {currentList.items.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary dark:text-text-secondary-dark">
                      <p className="my-2">No items in this grocery list yet.</p>
                      <p className="my-2">
                        Add some items above to get started!
                      </p>
                    </div>
                  ) : (
                    currentList.items
                      .sort((a, b) => {
                        // Show uncompleted items first
                        if (a.completed !== b.completed) {
                          return a.completed ? 1 : -1;
                        }
                        // Then sort by creation date
                        return (
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                        );
                      })
                      .map((item) => (
                        <GroceryItemComponent
                          key={item.id}
                          item={item}
                          onToggle={handleToggleItem}
                          onRemove={handleRemoveItem}
                        />
                      ))
                  )}
                </div>
                {currentList.items.length > 0 && (
                  <div className="text-center p-4 rounded-md text-sm bg-primary-200 dark:bg-primary-200-dark text-text-secondary dark:text-text-secondary-dark">
                    <p>
                      {
                        currentList.items.filter((item) => item.completed)
                          .length
                      }
                      &nbsp;of&nbsp;{currentList.items.length} items completed
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 rounded-lg text-text-secondary dark:text-text-secondary-dark bg-primary-100 dark:bg-primary-100-dark border border-border dark:border-border-dark">
                <p>
                  Select a list from above to start managing your grocery items.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
