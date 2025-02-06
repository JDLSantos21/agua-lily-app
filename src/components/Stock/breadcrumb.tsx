"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StockBreadcrumb() {
  const pathname = usePathname(); // Obtener la ruta actual
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // Eliminar el primer "dashboard"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Siempre mostrar el Dashboard como primer breadcrumb */}
        <BreadcrumbItem>
          <Link href="/inventario">Inventario</Link>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const url = `/inventario/${pathSegments
            .slice(0, index + 1)
            .join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const formattedText =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <span key={url} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!isLast ? (
                  <Link href={url}>{formattedText}</Link>
                ) : (
                  <span>{formattedText}</span>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
