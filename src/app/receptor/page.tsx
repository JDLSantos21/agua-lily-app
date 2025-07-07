"use client";

import { useOrdersForReceiver } from "@/hooks/useOrders";
import ReceptorHeader from "./components/header";
import OrderCard from "./components/order-card";
import { useEffect, useRef, useState } from "react";
import { LoaderSpin } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReceptorPage() {
  const { data: orders, isLoading, isError } = useOrdersForReceiver();
  const [previousOrderIds, setPreviousOrderIds] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!orders?.data) return;

    const currentOrderIds = orders.data
      .map((order) => order.id)
      .filter((id): id is number => typeof id === "number");
    const newOrders = currentOrderIds.filter(
      (id) => !previousOrderIds.includes(id)
    );

    if (newOrders.length > 0 && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Error al reproducir el sonido:", err);
      });
    }

    setPreviousOrderIds(currentOrderIds);
  }, [orders]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <LoaderSpin className="h-24 w-24" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex flex-col gap-4 items-center justify-center h-screen">
        <span className="text-2xl font-bold text-red-600">
          Ocurrió un problema al cargar los pedidos.
        </span>
        <Button variant="outline" onClick={() => router.refresh()}>
          Refrescar
        </Button>
      </main>
    );
  }

  if (!orders || orders.data.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="text-center">
          <img
            src="/images/no-orders.webp"
            alt="No hay pedidos"
            className="w-96 h-96 mx-auto"
          />
          <h1 className="text-2xl font-bold mb-4">No hay pedidos pendientes</h1>
          <p className="text-lg text-muted-foreground">
            Actualmente no hay pedidos para mostrar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="select-none">
      <ReceptorHeader />
      <div
        ref={containerRef}
        className={`grid ${orders.data.length <= 3 ? "grid-rows-2" : ""} grid-cols-2 4xl:grid-cols-3 gap-4 p-5 h-[calc(100vh-100px)] 4xl:h-[calc(100vh-165px)] overflow-y-auto`}
      >
        {orders.data.map((order) => (
          <OrderCard order={order} key={order.id} />
        ))}
        <audio ref={audioRef} src="/audio/notification.wav" />
      </div>
    </main>
  );
}
