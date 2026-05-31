export const CATEGORY_OPTIONS = [
  { value: "NOWOSCI", label: "Nowości" },
  { value: "WYPRZEDAZ", label: "Wyprzedaż" },
  { value: "DOM", label: "Dom" },
  { value: "OGROD", label: "Ogród" },
  { value: "MOTORYZACJA", label: "Motoryzacja" },
  { value: "AKCESORIA_DLA_ZWIERZAT", label: "Akcesoria dla zwierząt" },
];

export function getPublicCategoryValue(category?: string | null, subcategory?: string | null) {
  if (category === "DOM_I_OGROD" && subcategory === "OGROD") return "OGROD";
  if (category === "DOM_I_OGROD" && subcategory === "WYPOSAZENIE") return "DOM";
  return category || "";
}

export function getCategoryLabel(category?: string | null, subcategory?: string | null) {
  const publicCategory = getPublicCategoryValue(category, subcategory);
  const option = CATEGORY_OPTIONS.find((item) => item.value === publicCategory);
  if (option) return option.label;
  if (category === "DOM_I_OGROD") return "Dom";
  return category || "";
}

export function mapPublicCategoryToProductPayload(category: string) {
  if (category === "DOM") {
    return { category: "DOM_I_OGROD", subcategory: "WYPOSAZENIE" };
  }

  if (category === "OGROD") {
    return { category: "DOM_I_OGROD", subcategory: "OGROD" };
  }

  return { category, subcategory: null };
}
