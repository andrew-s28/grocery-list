from django.db import models
from rest_framework import serializers

from .models import GroceryItem, GroceryList


class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = ["id", "text", "completed", "created_at"]
        read_only_fields = ["id", "created_at"]


class GroceryListSerializer(serializers.ModelSerializer):
    items = GroceryItemSerializer(many=True, read_only=True)

    class Meta:
        model = GroceryList
        fields = ["id", "username", "name", "is_public", "created_at", "items"]
        read_only_fields = ["id", "created_at"]


class GroceryListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = ["username", "name", "is_public"]
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=GroceryList.objects.filter(is_public=False),
                fields=["username", "name", "is_public"],
                message="A private grocery list with this name already exists for this user.",
            ),
            serializers.UniqueTogetherValidator(
                queryset=GroceryList.objects.filter(is_public=True),
                fields=["name", "is_public"],
                message="A public grocery list with this name already exists.",
            ),
        ]


class GroceryItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = ["text"]
