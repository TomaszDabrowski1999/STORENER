export const CATEGORY_OPTIONS = [
  { value: "NOWOSCI", label: "Nowości" },
  { value: "WYPRZEDAZ", label: "Wyprzedaż" },
  { value: "DOM", label: "Dom" },
  { value: "OGROD", label: "Ogród" },
  { value: "MOTORYZACJA", label: "Motoryzacja" },
  { value: "AKCESORIA_DLA_ZWIERZAT", label: "Akcesoria dla zwierząt" },
];

export function getPublicCategoryValue(category?: string | null, subcategory?: string | null) {
  if (category === "DOM" || category === "OGROD") return category;
  if (category === "DOM_I_OGROD" && subcategory === "OGROD") return "OGROD";
  if (category === "DOM_I_OGROD") return "DOM";
  return category || "";
}

export function getCategoryLabel(category?: string | null, subcategory?: string | null) {
  const publicCategory = getPublicCategoryValue(category, subcategory);
  const option = CATEGORY_OPTIONS.find((item) => item.value === publicCategory);
  return option?.label || category || "";
}

export function mapPublicCategoryToProductPayload(category: string) {
  // Docelowo zapisujemy normalne kategorie DOM / OGROD.
  // Stare rekordy DOM_I_OGROD są obsługiwane tylko jako kompatybilność wsteczna.
  return { category, subcategory: null };
}

export function matchesPublicCategory(product: { category?: string | null; subcategory?: string | null }, category: string) {
  return getPublicCategoryValue(product.category, product.subcategory) === category;
}
