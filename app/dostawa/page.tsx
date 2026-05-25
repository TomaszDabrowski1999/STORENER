import { shippingOptions } from "../../lib/shipping";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            dostawa
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Dostawa i kurierzy
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Wybierz wygodną formę dostawy podczas składania zamówienia. Koszt
            dostawy doliczany jest automatycznie w koszyku i na checkoutcie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {option.name}
                  </h2>
                  <p className="mt-2 text-gray-600">{option.description}</p>
                </div>

                <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-900">
                  {option.price === 0 ? "Gratis" : `${option.price.toFixed(2)} zł`}
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                Przewidywany czas: <strong>{option.estimatedDelivery}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
