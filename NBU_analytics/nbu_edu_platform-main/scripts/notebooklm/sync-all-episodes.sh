#!/usr/bin/env zsh
# Generates quiz, flashcards, test, mindmap, and transcript for episodes 2-5
# using the nlm CLI and NotebookLM notebooks.
#
# Usage: zsh scripts/notebooklm/sync-all-episodes.sh

set -euo pipefail
export NOTEBOOKLM_HL=ru

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h:h}"
GEN_DIR="$PROJECT_DIR/lib/course-content/generated"

extract_artifact_id() {
  grep -oiE 'Artifact ID:\s+[a-f0-9-]+' | head -1 | grep -oE '[a-f0-9-]+$'
}

extract_mindmap_id() {
  grep -oiE '\bID:\s+[a-f0-9-]+' | head -1 | grep -oE '[a-f0-9-]+$'
}

retry() {
  local max=3 attempt=1 delay=15
  while (( attempt <= max )); do
    if "$@" 2>&1; then return 0; fi
    echo "  Attempt $attempt/$max failed. Waiting ${delay}s..."
    sleep $delay
    (( delay *= 2 ))
    (( attempt++ ))
  done
  echo "  FAILED after $max attempts: $*" >&2
  return 1
}

process_episode() {
  local ep=$1 nb=$2 transcript_src=$3 quiz_focus=$4 fc_focus=$5 test_focus=$6 mm_title=$7
  local out="$GEN_DIR/episode-$ep"
  mkdir -p "$out"

  echo "━━━ Episode $ep ━━━"

  echo "  Creating quiz..."
  local quiz_out quiz_id
  quiz_out=$(retry nlm quiz create "$nb" --count 4 --difficulty 2 --focus "$quiz_focus" -y)
  quiz_id=$(echo "$quiz_out" | extract_artifact_id)
  echo "  Quiz ID: $quiz_id"

  echo "  Creating flashcards..."
  local fc_out fc_id
  fc_out=$(retry nlm flashcards create "$nb" --difficulty medium --focus "$fc_focus" -y)
  fc_id=$(echo "$fc_out" | extract_artifact_id)
  echo "  Flashcards ID: $fc_id"

  echo "  Creating test..."
  local test_out test_id
  test_out=$(retry nlm quiz create "$nb" --count 8 --difficulty 4 --focus "$test_focus" -y)
  test_id=$(echo "$test_out" | extract_artifact_id)
  echo "  Test ID: $test_id"

  echo "  Creating mind map..."
  local mm_out mm_id
  mm_out=$(retry nlm mindmap create "$nb" --title "$mm_title" -y)
  mm_id=$(echo "$mm_out" | extract_mindmap_id)
  echo "  Mind map ID: $mm_id"

  echo "  Downloading artifacts..."
  retry nlm download quiz "$nb" --id "$quiz_id" --output "$out/quiz.json" --format json
  retry nlm download flashcards "$nb" --id "$fc_id" --output "$out/flashcards.json" --format json
  retry nlm download quiz "$nb" --id "$test_id" --output "$out/test.json" --format json
  retry nlm download mind-map "$nb" --id "$mm_id" --output "$out/mind-map.json"
  retry nlm content source "$transcript_src" --output "$out/transcript.txt"

  echo "  Episode $ep done!"
  echo ""
}

echo "Generating content for episodes 2-5..."
echo ""

process_episode 2 \
  "45769978-3945-40f1-9fbc-144fc2c0fd51" \
  "6330e40b-8cb2-4e06-a627-3decc90f8cf6" \
  "Короткий квиз на русском о корпоративном хранилище данных: назначение КХД, архитектура, ETL-процессы, витрины данных, аналитические запросы и роль хранилища в принятии решений" \
  "Карточки на русском по корпоративному хранилищу данных: ETL, витрины данных, OLAP, Data Warehouse, staging area, аналитические запросы, качество загрузки данных" \
  "Итоговый тест на русском по корпоративному хранилищу данных: детальные вопросы об архитектуре КХД, ETL-процессах, проблемах загрузки, витринах данных и примеры из практики НБУ" \
  "Корпоративное хранилище данных"

process_episode 3 \
  "75671118-53d0-40f0-949c-95f132410eed" \
  "51e37d9c-c941-453b-9933-66b1ac1a6847" \
  "Короткий квиз на русском о типах данных в банке: структурированные, неструктурированные, метаданные, классификация, примеры каждого типа и их роль в банковских процессах" \
  "Карточки на русском по типам данных: структурированные данные, неструктурированные данные, метаданные, Big Data, Data Lake, классификация данных, управление данными" \
  "Итоговый тест на русском по типам данных: сложные вопросы о классификации данных, работе с неструктурированными данными, метаданных, практических примерах из банковской сферы" \
  "Типы данных в банковской системе"

process_episode 4 \
  "bf9b91f1-5b4d-47dd-988a-e1c2a37b5754" \
  "ff10f192-a6d0-4d68-a61a-074a70bb1d49" \
  "Короткий квиз на русском о пути данных от действия до решения: этапы обработки, трансформация, верификация, агрегация, аналитика и принятие управленческих решений на основе данных" \
  "Карточки на русском по пути данных: ввод данных, валидация, трансформация, загрузка, хранение, агрегация, визуализация, отчётность, принятие решений" \
  "Итоговый тест на русском по пути данных: сложные вопросы об этапах обработки данных, ошибках на каждом этапе, автоматизации, примеры из практики банка" \
  "Путь данных: от действия до решения"

process_episode 5 \
  "f3c2c50e-af02-4426-9a9a-e678c1add1ab" \
  "56958216-fa7d-4c9d-bc8f-f9bf29a4e4e0" \
  "Короткий квиз на русском о качестве данных в банке: точность, своевременность, полнота, согласованность, метрики качества и влияние на бизнес-процессы" \
  "Карточки на русском по качеству данных: accuracy, timeliness, completeness, consistency, data profiling, data cleansing, мониторинг качества" \
  "Итоговый тест на русском по качеству данных: сложные вопросы о метриках качества, влиянии на AML/KYC, регуляторных рисках, практических примерах и мерах по улучшению" \
  "Качество данных в банке"

echo "All episodes generated successfully!"
