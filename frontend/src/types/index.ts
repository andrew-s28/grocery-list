export interface GroceryItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface GroceryList {
  id: string;
  username: string;
  isPublic: boolean;
  name: string;
  items: GroceryItem[];
  createdAt: Date;
}

export type ListType = 'public' | 'private' | 'explore';
