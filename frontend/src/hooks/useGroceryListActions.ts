import { useState, useCallback } from 'react';
import type { GroceryList, GroceryItem } from '../types';
import { GroceryAPI } from '../services/api';

export function useGroceryListActions(list: GroceryList | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback(async (text: string): Promise<GroceryItem | undefined> => {
    if (!list) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await GroceryAPI.addItem(list.id, text);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      console.error('Error adding item:', err);
    } finally {
      setLoading(false);
    }
  }, [list]);

  const toggleItem = useCallback(async (itemId: string): Promise<GroceryItem | undefined> => {
    if (!list) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedItem = await GroceryAPI.toggleItem(list.id, itemId);
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle item');
      console.error('Error toggling item:', err);
    } finally {
      setLoading(false);
    }
  }, [list]);

  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    if (!list) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await GroceryAPI.removeItem(list.id, itemId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      console.error('Error removing item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [list]);

  const clearCompleted = useCallback(async (): Promise<boolean> => {
    if (!list) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await GroceryAPI.clearCompletedItems(list.id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed items');
      console.error('Error clearing completed items:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [list]);

  return {
    loading,
    error,
    addItem,
    toggleItem,
    removeItem,
    clearCompleted,
  };
}
