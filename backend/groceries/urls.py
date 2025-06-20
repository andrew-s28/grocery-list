from django.urls import path

from . import views

urlpatterns = [
    # Lists endpoints
    path("lists/", views.grocery_lists, name="grocery_lists"),
    path("lists/public/", views.public_lists, name="public_lists"),
    path("lists/<uuid:list_id>/", views.grocery_list_detail, name="grocery_list_detail"),
    # Items endpoints
    path("lists/<uuid:list_id>/items/", views.add_item, name="add_item"),
    path("lists/<uuid:list_id>/items/<uuid:item_id>/", views.grocery_item_detail, name="grocery_item_detail"),
    path("lists/<uuid:list_id>/clear-completed/", views.clear_completed, name="clear_completed"),
]
