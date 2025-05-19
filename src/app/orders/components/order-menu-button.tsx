// src/app/orders/order-menu-button.tsx
"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderForm from "./order-form";

export default function NewOrderButton() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="gap-1"
        onClick={() => setIsOrderFormOpen(true)}
      >
        <PlusIcon className="h-4 w-4" />
        <span>Nuevo Pedido</span>
      </Button>

      <OrderForm
        open={isOrderFormOpen}
        onOpenChange={setIsOrderFormOpen}
        initialOrder={null}
      />
    </>
  );
}
