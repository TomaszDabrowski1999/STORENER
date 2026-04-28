"use client";

type AddToCartButtonProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: AddToCartButtonProps) {
  const handleAddToCart = () => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item: any) => item.id === id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Produkt dodany do koszyka");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90"
    >
      Dodaj do koszyka
    </button>
  );
}