"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { maximum, mergePosts, validMessage, type Post } from "../lib/posts";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }) : null;
const pageSize = 500;
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function Wall() {
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [sending, setSending] = useState(false);
  const [live, setLive] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [shareError, setShareError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, retry] = useState(0);

  useEffect(() => {
    const client = db;
    if (!client) return;
    let active = true;
    let request = 0;
    async function getPosts() {
      const current = ++request;
      const loaded: Post[] = [];
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await client!.from("posts").select("id,body,created_at")
          .order("created_at", { ascending: false }).order("id", { ascending: false })
          .range(offset, offset + pageSize - 1);
        if (!active || current !== request) return;
        if (error) {
          setLoadError("Could not load the wall. Please try again.");
          setLoading(false);
          return;
        }
        loaded.push(...data);
        if (data.length < pageSize) break;
      }
      setPosts(previous => mergePosts(previous, loaded));
      setLoadError("");
      setLoading(false);
    }

    const channel = client.channel("my-wall:posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, ({ new: row }) => {
        if (active) setPosts(previous => mergePosts(previous, [row as Post]));
      })
      .subscribe(status => {
        if (!active) return;
        setLive(status === "SUBSCRIBED");
        if (status === "SUBSCRIBED") void getPosts();
      });
    void getPosts();
    return () => { active = false; void client.removeChannel(channel); };
  }, [attempt]);

  async function share(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!db || sending || !validMessage(body)) return;
    setSending(true);
    setShareError("");
    setNotice("");
    try {
      const { data, error } = await db.from("posts").insert({ body }).select("id,body,created_at").single();
      if (error) throw error;
      setPosts(previous => mergePosts(previous, [data]));
      setDraft("");
      setNotice("Message shared.");
    } catch {
      setShareError("Your message could not be shared. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section aria-labelledby="composer-title" className="mb-6 overflow-hidden rounded-lg border border-[#cbd6e5] bg-white shadow-sm">
        <h2 id="composer-title" className="border-b border-[#d4ddeb] bg-[#e8eef8] px-5 py-3 text-sm font-bold text-[#274e89]">Write on the wall</h2>
        <form className="p-5" onSubmit={share}>
          <label htmlFor="message" className="sr-only">Your message</label>
          <Textarea id="message" value={draft} disabled={sending} maxLength={maximum} aria-describedby="character-count wall-visibility" placeholder="What’s on your mind?" onChange={event => { setDraft(event.target.value); setNotice(""); }} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p id="wall-visibility" className="text-xs text-[#52647c]">Posts are public.</p>
            <div className="ml-auto flex items-center gap-4">
              <span id="character-count" className="text-xs tabular-nums text-[#52647c]">{draft.length}/{maximum}</span>
              <Button type="submit" disabled={!db || sending || !validMessage(draft)}>{sending ? "Sharing…" : "Share"}</Button>
            </div>
          </div>
          {shareError && <p role="alert" className="mt-3 text-sm text-red-800">{shareError}</p>}
          <p role="status" className="sr-only">{notice}</p>
        </form>
      </section>
      <section aria-labelledby="feed-title" className="overflow-hidden rounded-lg border border-[#cbd6e5] bg-white shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-[#d4ddeb] bg-[#e8eef8] px-5 py-3">
          <h2 id="feed-title" className="text-sm font-bold text-[#274e89]">Recent posts</h2>
          <span className="flex items-center gap-2 text-xs text-[#445973]"><span aria-hidden className={live ? "size-2 rounded-full bg-green-700" : "size-2 rounded-full bg-slate-400"} />{live ? "Live" : db ? "Connecting…" : "Not connected"}</span>
        </header>
        {!db && <p className="p-5 text-sm text-[#52647c]">Connect a Supabase project to load and share messages.</p>}
        {loading && <p role="status" className="p-5 text-sm text-[#52647c]">Loading the wall…</p>}
        {loadError && <div className="flex flex-wrap items-center gap-3 p-5"><p role="alert" className="text-sm text-red-800">{loadError}</p><Button type="button" onClick={() => { setLoadError(""); setLoading(true); retry(value => value + 1); }}>Retry</Button></div>}
        {db && !loading && !loadError && posts.length === 0 && <p className="p-5 text-sm text-[#52647c]">No posts yet. Write the first message!</p>}
        <ul className="divide-y divide-[#e0e7f0]">
          {posts.map(post => <li key={post.id} className="flex gap-3 px-5 py-4">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-[#e5edf9] text-sm font-bold text-[#335687]">G</span>
            <article className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-sm font-bold text-[#274e89]">Guest</span><time className="text-xs text-[#52647c]" dateTime={post.created_at}>{dateFormat.format(new Date(post.created_at))}</time></div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{post.body}</p>
            </article>
          </li>)}
        </ul>
      </section>
    </>
  );
}
