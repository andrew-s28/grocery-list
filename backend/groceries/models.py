import uuid

from django.db import models


class GroceryList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150)
    name = models.CharField(max_length=200)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.username}'s {self.name}"


class GroceryItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    grocery_list = models.ForeignKey(GroceryList, on_delete=models.CASCADE, related_name="items")

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.text
