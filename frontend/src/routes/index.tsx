import { createFileRoute } from "@tanstack/react-router";
import { GroceryListApp } from "../components/GroceryListApp";

export const Route = createFileRoute("/")({
  component: GroceryListApp,
});
