export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-6 rounded-full bg-blue-100/60 blur-2xl"></div>
        <div className="relative flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-blue-200/60">
            <img src="/logo.png" alt="Dento Smart" className="h-12 w-12 animate-pulse" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">DENTO SMART</p>
            <p className="mt-2 text-xs text-gray-500">Smart Dental Anxiety Monitoring System</p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.2s]"></span>
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"></span>
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
