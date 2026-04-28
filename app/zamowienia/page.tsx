"use client";

import { useEffect, useState } from "react";
import { CartItem } from "../../types/cart";

type Order = {
  id: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  total: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Moje zamówienia</h1>

        {orders.length === 0 ? (
          <p className="mt-6 text-gray-600">Nie masz jeszcze żadnych zamówień.</p>
        ) : (
          <div className="mt-8 space-y-8">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div key={order.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Zamówienie #{order.id}</h2>
                      <p className="text-sm text-gray-600">
                        Data: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-2xl font-bold">{order.total.toFixed(2)} zł</p>
                  </div>

                  <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-semibold">Dane klienta</h3>

                      <div className="mt-3 space-y-1 text-gray-700">
                        <p>{order.customer.fullName}</p>
                        <p>{order.customer.email}</p>
                        <p>{order.customer.address}</p>
                        <p>
                          {order.customer.postalCode} {order.customer.city}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Produkty</h3>

                      <div className="mt-3 space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />

                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Ilość: {item.quantity}
                              </p>
                            </div>

                            <p className="font-bold">
                              {(item.price * item.quantity).toFixed(2)} zł
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}