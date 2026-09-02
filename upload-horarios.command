#!/bin/bash
set -u

REPO_URL="git@github.com:gecoas/untis.git"
ROOT="$(cd "$(dirname "$0")" && pwd)"
WORK_DIR="${TMPDIR:-/tmp}/untis-upload-repo"
LOG="$ROOT/upload-horarios.log"
COMMIT_MSG="Subir horarios Untis"
FOLDERS=(clases-pri prof-pri clases-eso prof-eso)

log() {
  printf '%s\n' "$*" | tee -a "$LOG"
}

fail() {
  log "ERROR: $*"
  log "Revisa el log: $LOG"
  read -r -p "Pulsa Enter para cerrar... " _
  exit 1
}

echo "Inicio $(date '+%d/%m/%Y %H:%M:%S')" > "$LOG"

command -v git >> "$LOG" 2>&1 || fail "Git no esta instalado. Instala Git o Xcode Command Line Tools."
command -v python3 >> "$LOG" 2>&1 || fail "python3 no esta instalado. Instala Xcode Command Line Tools."

for folder in "${FOLDERS[@]}"; do
  [[ -d "$ROOT/$folder" ]] || fail "No existe la carpeta $folder junto a este script."
  compgen -G "$ROOT/$folder/*.htm" > /dev/null || fail "La carpeta $folder no contiene archivos .htm."
done

if [[ -d "$WORK_DIR" ]]; then
  log "Eliminando carpeta temporal..."
  rm -rf "$WORK_DIR" || fail "No se pudo eliminar la carpeta temporal."
fi

log "Clonando repositorio..."
git clone "$REPO_URL" "$WORK_DIR" >> "$LOG" 2>&1 || fail "No se pudo clonar el repositorio. Comprueba la clave SSH de GitHub."
log "Repositorio clonado."

for folder in "${FOLDERS[@]}"; do
  log "Copiando $folder..."
  rm -rf "$WORK_DIR/$folder"
  mkdir -p "$WORK_DIR/$folder" || fail "No se pudo crear $folder en la copia temporal."
  rsync -a --exclude '.git' --exclude 'Thumbs.db' --exclude 'Desktop.ini' "$ROOT/$folder/" "$WORK_DIR/$folder/" >> "$LOG" 2>&1 || fail "Fallo al copiar $folder."
  cp "$WORK_DIR/untis.css" "$WORK_DIR/$folder/untis.css" || fail "No se pudo copiar untis.css en $folder."
  log "Preparando $folder..."
  python3 "$WORK_DIR/scripts/prepare-horarios.py" --folder "$WORK_DIR/$folder" >> "$LOG" 2>&1 || fail "No se pudo preparar $folder."
done

log "Coloreando lecciones..."
python3 "$WORK_DIR/scripts/color-lessons.py" --root "$WORK_DIR" >> "$LOG" 2>&1 || fail "No se pudieron colorear las lecciones."

log "Validando copia antes del commit..."
for folder in "${FOLDERS[@]}"; do
  compgen -G "$WORK_DIR/$folder/*.htm" > /dev/null || fail "$folder no contiene .htm en la copia temporal."
done

cd "$WORK_DIR" || fail "No se pudo entrar en la carpeta temporal."
git add -A >> "$LOG" 2>&1 || fail "No se pudo preparar el commit."

if git diff --cached --quiet; then
  log "No hay cambios nuevos que subir."
  read -r -p "Pulsa Enter para cerrar... " _
  exit 0
fi

if git diff --cached --name-status -- clases-pri prof-pri clases-eso prof-eso | grep -q '^D'; then
  fail "Git detecta borrados de horarios. No se crea commit para evitar borrar horarios en GitHub."
fi

log "Creando commit..."
git commit -m "$COMMIT_MSG" >> "$LOG" 2>&1 || fail "No se pudo crear el commit."

log "Subiendo a GitHub..."
git push origin main >> "$LOG" 2>&1 || fail "No se pudo hacer push. Comprueba la clave SSH de GitHub."

log "Fin $(date '+%d/%m/%Y %H:%M:%S')"
log "Horarios subidos correctamente a GitHub."
read -r -p "Pulsa Enter para cerrar... " _
