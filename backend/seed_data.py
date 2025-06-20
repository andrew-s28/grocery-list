import os
from datetime import datetime, timezone

import django
from groceries.models import GroceryItem, GroceryList

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "grocery_api.settings")
django.setup()

# Clear existing data
GroceryItem.objects.all().delete()
GroceryList.objects.all().delete()

# Create test data matching the frontend mock data
lists_data = [
    {
        "username": "demo",
        "name": "Weekly Groceries",
        "is_public": True,
        "items": [
            {"text": "Milk", "completed": False},
            {"text": "Bread", "completed": True},
        ],
    },
    {
        "username": "demo",
        "name": "Secret Shopping",
        "is_public": False,
        "items": [
            {"text": "Birthday cake ingredients", "completed": False},
        ],
    },
    {
        "username": "alice",
        "name": "Italian Night",
        "is_public": True,
        "items": [
            {"text": "Organic tomatoes", "completed": False},
            {"text": "Fresh basil", "completed": False},
            {"text": "Mozzarella cheese", "completed": True},
            {"text": "Olive oil", "completed": False},
        ],
    },
    {
        "username": "alice",
        "name": "Healthy Breakfast",
        "is_public": True,
        "items": [
            {"text": "Oatmeal", "completed": True},
            {"text": "Greek yogurt", "completed": False},
            {"text": "Fresh berries", "completed": False},
        ],
    },
    {
        "username": "bob",
        "name": "Meal Prep Monday",
        "is_public": True,
        "items": [
            {"text": "Chicken breast", "completed": True},
            {"text": "Brown rice", "completed": False},
            {"text": "Broccoli", "completed": False},
            {"text": "Greek yogurt", "completed": True},
            {"text": "Blueberries", "completed": False},
        ],
    },
    {
        "username": "charlie",
        "name": "Morning Essentials",
        "is_public": True,
        "items": [
            {"text": "Sourdough bread", "completed": False},
            {"text": "Avocados", "completed": True},
            {"text": "Coffee beans", "completed": False},
        ],
    },
]

for list_data in lists_data:
    grocery_list = GroceryList.objects.create(
        username=list_data["username"], name=list_data["name"], is_public=list_data["is_public"]
    )

    for item_data in list_data["items"]:
        GroceryItem.objects.create(text=item_data["text"], completed=item_data["completed"], grocery_list=grocery_list)

print(f"Created {GroceryList.objects.count()} grocery lists")
print(f"Created {GroceryItem.objects.count()} grocery items")
