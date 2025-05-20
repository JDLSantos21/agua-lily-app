export default function IsDevAlert({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-3xl font-bold">¡Hola!</span>
      <img src="/images/avatar/greet.webp" alt="greet" className="w-1/3" />
      <span className="text-muted-foreground text-lg pt-3">{message}</span>
    </div>
  );
}
