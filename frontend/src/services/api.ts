import type { GroceryItem, GroceryList } from '../types';

const API_BASE_URL = 'https://grocery.micdrew.house/api';

// Helper function to convert Django datetime to Date object
const parseDateTime = (dateString: string): Date => new Date(dateString);

// Helper function to transform Django response to frontend format
const transformList = (djangoList: any): GroceryList => ({
  id: djangoList.id,
  username: djangoList.username,
  name: djangoList.name,
  isPublic: djangoList.is_public,
  createdAt: parseDateTime(djangoList.created_at),
  items: djangoList.items.map((item: any) => ({
    id: item.id,
    text: item.text,
    completed: item.completed,
    createdAt: parseDateTime(item.created_at),
  })),
});

const transformItem = (djangoItem: any): GroceryItem => ({
  id: djangoItem.id,
  text: djangoItem.text,
  completed: djangoItem.completed,
  createdAt: parseDateTime(djangoItem.created_at),
});

export class GroceryAPI {
  static async getListsForUser(username: string, isPublic: boolean): Promise<GroceryList[]> {
    const params = new URLSearchParams({
      username,
      isPublic: isPublic.toString(),
    });
    
    const response = await fetch(`${API_BASE_URL}/lists/?${params}`);
    if (!response.ok) throw new Error('Failed to fetch lists');
    
    const data = await response.json();
    return data.map(transformList);
  }

  static async createList(username: string, name: string, isPublic: boolean): Promise<GroceryList> {
    const response = await fetch(`${API_BASE_URL}/lists/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        name,
        is_public: isPublic,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to create list');
    
    const data = await response.json();
    return transformList(data);
  }

  static async addItem(listId: string, text: string): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) throw new Error('Failed to add item');
    
    const data = await response.json();
    return transformItem(data);
  }

  static async toggleItem(listId: string, itemId: string): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/items/${itemId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to toggle item');
    
    const data = await response.json();
    return transformItem(data);
  }

  static async removeItem(listId: string, itemId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/items/${itemId}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to remove item');
  }

  static async clearCompletedItems(listId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/clear-completed/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to clear completed items');
  }

  static async getAllPublicLists(): Promise<GroceryList[]> {
    const response = await fetch(`${API_BASE_URL}/lists/public/`);
    if (!response.ok) throw new Error('Failed to fetch public lists');
    
    const data = await response.json();
    return data.map(transformList);
  }

  static async getPublicListsExcludingUser(excludeUsername: string): Promise<GroceryList[]> {
    const params = new URLSearchParams({
      excludeUsername,
    });
    
    const response = await fetch(`${API_BASE_URL}/lists/public/?${params}`);
    if (!response.ok) throw new Error('Failed to fetch public lists');
    
    const data = await response.json();
    return data.map(transformList);
  }

  static async getListById(listId: string): Promise<GroceryList | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch list');
      }
      
      const data = await response.json();
      return transformList(data);
    } catch (error) {
      console.error('Error fetching list:', error);
      return null;
    }
  }

  static async deleteList(listId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete list');
  }

  static async updateListName(listId: string, newName: string): Promise<GroceryList> {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });
    
    if (!response.ok) throw new Error('Failed to update list name');
    
    const data = await response.json();
    return transformList(data);
  }
}
