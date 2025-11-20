function App() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white px-6 py-5">
      <header className="mb-10 flex items-center justify-between">
        <img src="/netflix.png" alt="Netflix" className="h-8 w-auto" />
        <div>
          <input
            type="search"
            className="border border-white/15 px-2 py-1 rounded outline-0"
          />
          <button className=" w-20 text-sm px-3 py-1 rounded border border-white/20 dark:border-white/10 hover:bg-white hover:text-black dark:hover:bg-white/10 transition"></button>
        </div>
      </header>
      <main className="flex gap-6"></main>
    </div>
  );
}

export default App;
