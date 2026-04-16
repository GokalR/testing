import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const NOTEBOOK_ID = "cf83e86d-fd3e-4dee-be64-cef5c306276b";
const ROOT_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = join(ROOT_DIR, "..", "lib", "course-content", "generated", "episode-1");
const TRANSCRIPT_SOURCE_ID = "e6f5e910-d812-412d-a683-d3dbbff877b9";

interface ArtifactCreationResult {
  artifactId: string;
}

function extractArtifactId(output: string) {
  const match = output.match(/Artifact ID:\s+([a-f0-9-]+)/i);
  if (!match) {
    throw new Error(`Could not extract artifact ID from output:\n${output}`);
  }

  return match[1];
}

function extractMindMapId(output: string) {
  const match = output.match(/\bID:\s+([a-f0-9-]+)/i);
  if (!match) {
    throw new Error(`Could not extract mind map ID from output:\n${output}`);
  }

  return match[1];
}

async function runNlm(args: string[]) {
  const result = await execFileAsync("nlm", args, {
    env: {
      ...process.env,
      NOTEBOOKLM_HL: "ru",
    },
  });

  return `${result.stdout}\n${result.stderr}`.trim();
}

async function createQuiz(
  count: number,
  difficulty: number,
  focus: string,
): Promise<ArtifactCreationResult> {
  const output = await runNlm([
    "quiz",
    "create",
    NOTEBOOK_ID,
    "--count",
    String(count),
    "--difficulty",
    String(difficulty),
    "--focus",
    focus,
    "-y",
  ]);

  return { artifactId: extractArtifactId(output) };
}

async function createFlashcards(focus: string): Promise<ArtifactCreationResult> {
  const output = await runNlm([
    "flashcards",
    "create",
    NOTEBOOK_ID,
    "--difficulty",
    "medium",
    "--focus",
    focus,
    "-y",
  ]);

  return { artifactId: extractArtifactId(output) };
}

async function createMindMap(title: string): Promise<ArtifactCreationResult> {
  const output = await runNlm([
    "mindmap",
    "create",
    NOTEBOOK_ID,
    "--title",
    title,
    "-y",
  ]);

  return { artifactId: extractMindMapId(output) };
}

async function runDownload(args: string[]) {
  await runNlm(args);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const shortQuiz = await createQuiz(
    4,
    2,
    "Короткий квиз на русском о том, что считается банковскими данными, как ошибки каскадно влияют на системы, сервис, риски и ответственность сотрудника",
  );
  const flashcards = await createFlashcards(
    "Карточки на русском по качеству банковских данных: статус операции, канал обслуживания, идентификатор клиента, код сотрудника, влияние на AML/KYC и культуру качества данных",
  );
  const longQuiz = await createQuiz(
    8,
    4,
    "Итоговый тест на русском по примерам из буклета: типичные ошибки, операционные последствия, регуляторные риски, влияние на сервис и распределение ответственности",
  );
  const mindMap = await createMindMap("Данные как основа банковской работы");

  await runDownload([
    "download",
    "quiz",
    NOTEBOOK_ID,
    "--id",
    shortQuiz.artifactId,
    "--output",
    join(OUTPUT_DIR, "quiz.json"),
    "--format",
    "json",
  ]);
  await runDownload([
    "download",
    "flashcards",
    NOTEBOOK_ID,
    "--id",
    flashcards.artifactId,
    "--output",
    join(OUTPUT_DIR, "flashcards.json"),
    "--format",
    "json",
  ]);
  await runDownload([
    "download",
    "quiz",
    NOTEBOOK_ID,
    "--id",
    longQuiz.artifactId,
    "--output",
    join(OUTPUT_DIR, "test.json"),
    "--format",
    "json",
  ]);
  await runDownload([
    "download",
    "mind-map",
    NOTEBOOK_ID,
    "--id",
    mindMap.artifactId,
    "--output",
    join(OUTPUT_DIR, "mind-map.json"),
  ]);
  await runDownload([
    "content",
    "source",
    TRANSCRIPT_SOURCE_ID,
    "--output",
    join(OUTPUT_DIR, "transcript.txt"),
  ]);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
