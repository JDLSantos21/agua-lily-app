// src/app/clientes/layout.tsx
"use client";

import SideNav from "@/ui/sidenav/sidenav";
// import { ClientesNav } from "./components/clientes-nav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";
import { CustomerFormDialog } from "./components/customer-form-dialog";

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-auto">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto mx-auto">
          {/* <ClientesNav onNewCustomer={() => setIsNewCustomerDialogOpen(true)} /> */}
          <div className="mt-5">{children}</div>

          {/* Diálogo para crear nuevo cliente desde cualquier página */}
          <CustomerFormDialog
            open={isNewCustomerDialogOpen}
            onOpenChange={setIsNewCustomerDialogOpen}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
