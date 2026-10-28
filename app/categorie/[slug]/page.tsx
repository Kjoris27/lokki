import { redirect } from "next/navigation";

// Keep legacy category URLs useful after replacing equipment with game packs.
export default function CategoryPage() {
  redirect("/catalogue");
}
