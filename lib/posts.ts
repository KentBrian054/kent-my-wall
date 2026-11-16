export type Post = { id: string; body: string; created_at: string };
export const maximum = 280;
export function validMessage(value: string) {
  const body = value.trim();
  return body.length > 0 && body.length <= maximum;
}
export function mergePosts(previous: Post[], incoming: Post[]) {
  const byId = new Map(previous.map(post => [post.id, post]));
  for (const post of incoming) byId.set(post.id, post);
  return [...byId.values()].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id.localeCompare(a.id));
}

