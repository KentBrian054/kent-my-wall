import { Wall } from "@/components/wall";

export default function Page() {
  return (
    <>
      <header className="border-b border-[#1d3e79] bg-[#294f91] text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
          <span aria-hidden className="grid size-8 place-items-center rounded bg-white font-black text-[#294f91]">W</span>
          <span className="text-xl font-bold tracking-tight">My Wall</span>
          <span className="ml-auto text-xs text-blue-100">Community board</span>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-6 px-5 pb-12 pt-8 sm:px-8 sm:pt-12 md:grid-cols-[minmax(0,1fr)_225px]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#3b5b8c]">The social wall</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">The Wall</h1>
          <p className="mb-7 mt-3 text-sm leading-relaxed text-[#52647c]">A little corner of the internet for your thoughts and updates.</p>
          <Wall />
        </div>
        <aside className="h-fit rounded-lg border border-[#cbd6e5] bg-white md:mt-24">
          <h2 className="rounded-t-lg border-b border-[#d4ddeb] bg-[#e8eef8] px-4 py-3 text-sm font-bold text-[#274e89]">About this wall</h2>
          <div className="p-4 text-sm leading-relaxed text-[#52647c]">Inspired by the classic 2008 social wall. Everyone can read and share short messages. New posts appear at the top.</div>
        </aside>
      </main>
    </>
  );
}
