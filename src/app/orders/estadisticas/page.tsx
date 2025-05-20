import IsDevAlert from "@/components/is-dev-alert";

export default function EstadisticasPage() {
  return (
    <div className="flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold">Estadísticas</h1>
      <p className="text-gray-600">
        Aquí puedes ver las estadísticas de tus pedidos y productos.
      </p>
      <div className="grid h-full place-content-center">
        <IsDevAlert
          message="Este módulo está en desarrollo. Vuelve pronto para ver las estadísticas
        de tus pedidos y productos."
        />
      </div>
    </div>
  );
}
