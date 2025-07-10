import IsDevAlert from "@/components/is-dev-alert";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold">Calendario</h1>
      <p className="text-gray-600">
        Aquí puedes ver los pedidos en formato calendario.
      </p>
      <div className="grid h-full place-content-center">
        <IsDevAlert message="Este módulo está en desarrollo. Vuelve pronto para ver el calendario." />
      </div>
    </div>
  );
}
