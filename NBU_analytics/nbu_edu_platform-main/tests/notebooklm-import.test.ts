import assert from "node:assert/strict";
import test from "node:test";
import { getCourseSeries } from "@/lib/course-content";

test("episode 1 exposes normalized Russian learning artifacts", () => {
  const episode = getCourseSeries("ru").episodes[0] as unknown as Record<
    string,
    unknown
  >;
  const transcript = Reflect.get(episode, "transcript");
  const quiz = Reflect.get(episode, "quiz") as
    | { questions?: unknown[] }
    | undefined;
  const flashcards = Reflect.get(episode, "flashcards") as
    | { cards?: unknown[] }
    | undefined;
  const mentalMap = Reflect.get(episode, "mentalMap") as
    | { root?: { label?: string } }
    | undefined;
  const testArtifact = Reflect.get(episode, "test") as
    | { questions?: unknown[] }
    | undefined;

  assert.equal(typeof transcript, "string");
  assert.ok((transcript as string).length > 100);
  assert.ok((quiz?.questions?.length ?? 0) >= 3);
  assert.ok((flashcards?.cards?.length ?? 0) >= 4);
  assert.ok((mentalMap?.root?.label ?? "").length > 0);
  assert.ok((testArtifact?.questions?.length ?? 0) >= 5);
});
