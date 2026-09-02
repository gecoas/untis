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

expected_index() {
  case "$1" in
    clases-*) printf 'Clases.htm' ;;
    prof-*) printf 'Profesores.htm' ;;
    *) printf '' ;;
  esac
}

log_file_info() {
  local label="$1"
  local file="$2"
  if [[ -f "$file" ]]; then
    log "$label: $file"
    stat -f '  modificado: %Sm' -t '%d/%m/%Y %H:%M:%S' "$file" >> "$LOG" 2>&1 || true
    shasum -a 256 "$file" >> "$LOG" 2>&1 || true
  else
    log "$label: NO EXISTE $file"
  fi
}

echo "Inicio $(date '+%d/%m/%Y %H:%M:%S')" > "$LOG"

command -v git >> "$LOG" 2>&1 || fail "Git no esta instalado. Instala Git o Xcode Command Line Tools."
command -v python3 >> "$LOG" 2>&1 || fail "python3 no esta instalado. Instala Xcode Command Line Tools."

for folder in "${FOLDERS[@]}"; do
  [[ -d "$ROOT/$folder" ]] || fail "No existe la carpeta $folder junto a este script."
  compgen -G "$ROOT/$folder/*.htm" > /dev/null || fail "La carpeta $folder no contiene archivos .htm."
  index_file="$(expected_index "$folder")"
  [[ -f "$ROOT/$folder/$index_file" ]] || fail "La carpeta $folder no contiene $index_file."
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
  index_file="$(expected_index "$folder")"
  log_file_info "Indice origen $folder" "$ROOT/$folder/$index_file"
  rm -rf "$WORK_DIR/$folder"
  mkdir -p "$WORK_DIR/$folder" || fail "No se pudo crear $folder en la copia temporal."
  rsync -a --exclude '.git' --exclude 'Thumbs.db' --exclude 'Desktop.ini' "$ROOT/$folder/" "$WORK_DIR/$folder/" >> "$LOG" 2>&1 || fail "Fallo al copiar $folder."
  [[ -f "$WORK_DIR/$folder/$index_file" ]] || fail "No se copio $index_file en $folder."
  log_file_info "Indice copiado $folder" "$WORK_DIR/$folder/$index_file"
  cp "$WORK_DIR/untis.css" "$WORK_DIR/$folder/untis.css" || fail "No se pudo copiar untis.css en $folder."
  log "Preparando $folder..."
  python3 "$WORK_DIR/scripts/prepare-horarios.py" --folder "$WORK_DIR/$folder" >> "$LOG" 2>&1 || fail "No se pudo preparar $folder."
  log_file_info "Indice preparado $folder" "$WORK_DIR/$folder/$index_file"
done

log "Coloreando lecciones..."
python3 "$WORK_DIR/scripts/color-lessons.py" --root "$WORK_DIR" >> "$LOG" 2>&1 || fail "No se pudieron colorear las lecciones."

log "Validando copia antes del commit..."
for folder in "${FOLDERS[@]}"; do
  compgen -G "$WORK_DIR/$folder/*.htm" > /dev/null || fail "$folder no contiene .htm en la copia temporal."
  index_file="$(expected_index "$folder")"
  [[ -f "$WORK_DIR/$folder/$index_file" ]] || fail "$folder no contiene $index_file en la copia temporal."
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

log "Archivos que se van a subir:"
git diff --cached --name-status >> "$LOG" 2>&1

log "Creando commit..."
git commit -m "$COMMIT_MSG" >> "$LOG" 2>&1 || fail "No se pudo crear el commit."

log "Subiendo a GitHub..."
git push origin main >> "$LOG" 2>&1 || fail "No se pudo hacer push. Comprueba la clave SSH de GitHub."

log "Fin $(date '+%d/%m/%Y %H:%M:%S')"
log "Horarios subidos correctamente a GitHub."
read -r -p "Pulsa Enter para cerrar... " _
