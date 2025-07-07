export default function ReceptorHeader() {
  return (
    <header className="flex items-center py-4 px-10 shadow-blue-600 shadow-sm justify-between z-50 bg-white sticky top-0">
      <div className="max-w-[80px] 4xl:max-w-[125px]">
        <img src="/logo.png" alt="logo agua lily" />
      </div>
      <h1 className="text-3xl 4xl:text-5xl font-extrabold uppercase text-blue-600">
        Receptor
      </h1>
      <div className="bg-green-100 w-10 h-10 p-2 rounded-full flex items-center justify-center animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>
        {/* <span>Online</span> */}
      </div>
    </header>
  );
}
