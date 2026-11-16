import assert from "node:assert/strict";
import test from "node:test";
import { mergePosts, validMessage } from "../lib/posts.ts";
const old = {id:"A", body:"First", created_at:"2026-11-16T08:00:00Z"};
const recent = {id:"B", body:"Second", created_at:"2026-11-16T08:00:01Z"};
test("rejects empty/whitespace and enforces the 280 limit", () => {
  for (const invalid of ["", "   ", "x".repeat(281)]) assert.equal(validMessage(invalid),false);
  assert.equal(validMessage("x".repeat(280)),true);
});
test("puts new posts first, deduplicates and handles a late fetch", () => {
  assert.deepEqual(mergePosts([recent], [old,recent]), [recent,old]);
});
