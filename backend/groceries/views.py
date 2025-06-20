from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from .models import GroceryItem, GroceryList
from .serializers import (
    GroceryItemCreateSerializer,
    GroceryItemSerializer,
    GroceryListCreateSerializer,
    GroceryListSerializer,
)


@api_view(["GET", "POST"])
def grocery_lists(request) -> Response:
    """
    GET: Get lists for a user (filtered by username and isPublic query params)
    POST: Create a new grocery list
    """
    if request.method == "GET":
        username = request.query_params.get("username")
        is_public = request.query_params.get("isPublic")

        queryset = GroceryList.objects.all()

        if username is not None:
            queryset = queryset.filter(username=username)

        if is_public is not None:
            is_public_bool = is_public.lower() == "true"
            queryset = queryset.filter(is_public=is_public_bool)

        serializer = GroceryListSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = GroceryListCreateSerializer(data=request.data)
        if serializer.is_valid():
            grocery_list = serializer.save()
            return Response(GroceryListSerializer(grocery_list).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["GET"])
def public_lists(request) -> Response:
    """Get all public lists"""
    exclude_username = request.query_params.get("excludeUsername")

    queryset = GroceryList.objects.filter(is_public=True)

    if exclude_username:
        queryset = queryset.exclude(username=exclude_username)

    serializer = GroceryListSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
def grocery_list_detail(request, list_id) -> Response:
    """
    GET: Get a specific list by ID
    PUT: Update list name
    DELETE: Delete a list
    """
    grocery_list = get_object_or_404(GroceryList, id=list_id)

    if request.method == "GET":
        serializer = GroceryListSerializer(grocery_list)
        return Response(serializer.data)
    elif request.method == "PUT":
        name = request.data.get("name")
        if name:
            grocery_list.name = name
            grocery_list.save()
            serializer = GroceryListSerializer(grocery_list)
            return Response(serializer.data)
        return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        grocery_list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["POST"])
def add_item(request, list_id) -> Response:
    """Add an item to a grocery list"""
    grocery_list = get_object_or_404(GroceryList, id=list_id)

    serializer = GroceryItemCreateSerializer(data=request.data)
    if serializer.is_valid():
        item = serializer.save(grocery_list=grocery_list)
        return Response(GroceryItemSerializer(item).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def grocery_item_detail(request, list_id, item_id) -> Response:
    """
    PUT: Toggle item completion status
    DELETE: Remove an item from a grocery list
    """
    grocery_list = get_object_or_404(GroceryList, id=list_id)
    item = get_object_or_404(GroceryItem, id=item_id, grocery_list=grocery_list)

    if request.method == "PUT":
        item.completed = not item.completed
        item.save()
        serializer = GroceryItemSerializer(item)
        return Response(serializer.data)
    elif request.method == "DELETE":
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["DELETE"])
def clear_completed(request, list_id) -> Response:
    """Clear all completed items from a grocery list"""
    grocery_list = get_object_or_404(GroceryList, id=list_id)
    completed_items = GroceryItem.objects.filter(grocery_list=grocery_list, completed=True)
    completed_items.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
