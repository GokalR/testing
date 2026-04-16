#!/bin/zsh
set -euo pipefail
export NOTEBOOKLM_HL=ru

GEN="/Users/boiskhonkattakhodjaev/Desktop/Каган/eduapp/lib/course-content/generated"

extract_aid() { grep -oE 'Artifact ID:\s+[a-f0-9-]+' | head -1 | awk '{print $NF}'; }
extract_mid() { grep -oE '\bID:\s+[a-f0-9-]+' | head -1 | awk '{print $NF}'; }

# Episode 2 — Корпоративное хранилище данных
NB2="45769978-3945-40f1-9fbc-144fc2c0fd51"
TS2="6330e40b-8cb2-4e06-a627-3decc90f8cf6"
mkdir -p "$GEN/episode-2"

echo "=== EP2: Quiz ==="
Q2=$(nlm quiz create $NB2 --count 4 --difficulty 2 --focus "Квиз о корпоративном хранилище данных" -y 2>&1 | extract_aid)
echo "  ID: $Q2"

echo "=== EP2: Flashcards ==="
F2=$(nlm flashcards create $NB2 --difficulty medium --focus "Карточки по КХД и ETL" -y 2>&1 | extract_aid)
echo "  ID: $F2"

echo "=== EP2: Test ==="
T2=$(nlm quiz create $NB2 --count 8 --difficulty 4 --focus "Тест по хранилищу данных" -y 2>&1 | extract_aid)
echo "  ID: $T2"

echo "=== EP2: Mind Map ==="
M2=$(nlm mindmap create $NB2 --title "Корпоративное хранилище данных" -y 2>&1 | extract_mid)
echo "  ID: $M2"

echo "=== EP2: Downloads ==="
nlm download quiz $NB2 --id $Q2 --output "$GEN/episode-2/quiz.json" --format json 2>&1
nlm download flashcards $NB2 --id $F2 --output "$GEN/episode-2/flashcards.json" --format json 2>&1
nlm download quiz $NB2 --id $T2 --output "$GEN/episode-2/test.json" --format json 2>&1
nlm download mind-map $NB2 --id $M2 --output "$GEN/episode-2/mind-map.json" 2>&1
nlm content source $TS2 --output "$GEN/episode-2/transcript.txt" 2>&1
echo "=== EP2 Done ==="

# Episode 3 — Типы данных
NB3="75671118-53d0-40f0-949c-95f132410eed"
TS3="51e37d9c-c941-453b-9933-66b1ac1a6847"
mkdir -p "$GEN/episode-3"

echo "=== EP3: Quiz ==="
Q3=$(nlm quiz create $NB3 --count 4 --difficulty 2 --focus "Квиз о типах данных в банке" -y 2>&1 | extract_aid)
echo "  ID: $Q3"

echo "=== EP3: Flashcards ==="
F3=$(nlm flashcards create $NB3 --difficulty medium --focus "Карточки по типам данных" -y 2>&1 | extract_aid)
echo "  ID: $F3"

echo "=== EP3: Test ==="
T3=$(nlm quiz create $NB3 --count 8 --difficulty 4 --focus "Тест по типам данных" -y 2>&1 | extract_aid)
echo "  ID: $T3"

echo "=== EP3: Mind Map ==="
M3=$(nlm mindmap create $NB3 --title "Типы данных в банковской системе" -y 2>&1 | extract_mid)
echo "  ID: $M3"

echo "=== EP3: Downloads ==="
nlm download quiz $NB3 --id $Q3 --output "$GEN/episode-3/quiz.json" --format json 2>&1
nlm download flashcards $NB3 --id $F3 --output "$GEN/episode-3/flashcards.json" --format json 2>&1
nlm download quiz $NB3 --id $T3 --output "$GEN/episode-3/test.json" --format json 2>&1
nlm download mind-map $NB3 --id $M3 --output "$GEN/episode-3/mind-map.json" 2>&1
nlm content source $TS3 --output "$GEN/episode-3/transcript.txt" 2>&1
echo "=== EP3 Done ==="

# Episode 4 — Путь данных
NB4="bf9b91f1-5b4d-47dd-988a-e1c2a37b5754"
TS4="ff10f192-a6d0-4d68-a61a-074a70bb1d49"
mkdir -p "$GEN/episode-4"

echo "=== EP4: Quiz ==="
Q4=$(nlm quiz create $NB4 --count 4 --difficulty 2 --focus "Квиз о пути данных" -y 2>&1 | extract_aid)
echo "  ID: $Q4"

echo "=== EP4: Flashcards ==="
F4=$(nlm flashcards create $NB4 --difficulty medium --focus "Карточки по этапам обработки данных" -y 2>&1 | extract_aid)
echo "  ID: $F4"

echo "=== EP4: Test ==="
T4=$(nlm quiz create $NB4 --count 8 --difficulty 4 --focus "Тест по пути данных" -y 2>&1 | extract_aid)
echo "  ID: $T4"

echo "=== EP4: Mind Map ==="
M4=$(nlm mindmap create $NB4 --title "Путь данных: от действия до решения" -y 2>&1 | extract_mid)
echo "  ID: $M4"

echo "=== EP4: Downloads ==="
nlm download quiz $NB4 --id $Q4 --output "$GEN/episode-4/quiz.json" --format json 2>&1
nlm download flashcards $NB4 --id $F4 --output "$GEN/episode-4/flashcards.json" --format json 2>&1
nlm download quiz $NB4 --id $T4 --output "$GEN/episode-4/test.json" --format json 2>&1
nlm download mind-map $NB4 --id $M4 --output "$GEN/episode-4/mind-map.json" 2>&1
nlm content source $TS4 --output "$GEN/episode-4/transcript.txt" 2>&1
echo "=== EP4 Done ==="

# Episode 5 — Качество данных
NB5="f3c2c50e-af02-4426-9a9a-e678c1add1ab"
TS5="56958216-fa7d-4c9d-bc8f-f9bf29a4e4e0"
mkdir -p "$GEN/episode-5"

echo "=== EP5: Quiz ==="
Q5=$(nlm quiz create $NB5 --count 4 --difficulty 2 --focus "Квиз о качестве данных" -y 2>&1 | extract_aid)
echo "  ID: $Q5"

echo "=== EP5: Flashcards ==="
F5=$(nlm flashcards create $NB5 --difficulty medium --focus "Карточки по качеству данных" -y 2>&1 | extract_aid)
echo "  ID: $F5"

echo "=== EP5: Test ==="
T5=$(nlm quiz create $NB5 --count 8 --difficulty 4 --focus "Тест по качеству данных" -y 2>&1 | extract_aid)
echo "  ID: $T5"

echo "=== EP5: Mind Map ==="
M5=$(nlm mindmap create $NB5 --title "Качество данных в банке" -y 2>&1 | extract_mid)
echo "  ID: $M5"

echo "=== EP5: Downloads ==="
nlm download quiz $NB5 --id $Q5 --output "$GEN/episode-5/quiz.json" --format json 2>&1
nlm download flashcards $NB5 --id $F5 --output "$GEN/episode-5/flashcards.json" --format json 2>&1
nlm download quiz $NB5 --id $T5 --output "$GEN/episode-5/test.json" --format json 2>&1
nlm download mind-map $NB5 --id $M5 --output "$GEN/episode-5/mind-map.json" 2>&1
nlm content source $TS5 --output "$GEN/episode-5/transcript.txt" 2>&1
echo "=== EP5 Done ==="

echo ""
echo "ALL EPISODES GENERATED!"
