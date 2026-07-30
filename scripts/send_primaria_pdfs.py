#!/usr/bin/env python3
import argparse
import csv
import os
import re
import shutil
import smtplib
import subprocess
import sys
import unicodedata
from email.message import EmailMessage
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def normalize(value):
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return " ".join(value.split())


def tokens(value):
    return {part for part in normalize(value).split() if len(part) > 1}


def html_title(path):
    text = path.read_text(encoding="utf-8", errors="ignore")
    match = re.search(
        r'<font size="[45]"[^>]*>\s*(?:<B>)?\s*([^<\n][^<]*?)\s*(?:</B>)?\s*</font>',
        text,
        re.IGNORECASE,
    )
    return match.group(1).strip() if match else path.stem


def find_browser():
    env_path = os.environ.get("CHROME_PATH")
    if env_path and Path(env_path).exists():
        return env_path

    candidates = [
        shutil.which("chrome"),
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
        shutil.which("msedge"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return str(candidate)
    raise RuntimeError("No encuentro Chrome/Edge. Instala Chrome o define CHROME_PATH.")


def load_rows(csv_path):
    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter=";")
        required = {"Profesor", "email", "Tutor de Grupo"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise RuntimeError(f"Faltan columnas en CSV: {', '.join(sorted(missing))}")
        return [row for row in reader if row.get("Profesor") and row.get("email")]


def professor_files():
    entries = []
    for path in sorted((ROOT / "prof-pri").glob("Profesores_*.htm")):
        title = html_title(path)
        entries.append({"path": path, "title": title, "tokens": tokens(title)})
    return entries


def match_professor(name, entries):
    wanted = tokens(name)
    best = None
    best_score = 0
    for entry in entries:
        overlap = wanted & entry["tokens"]
        score = max(
            len(overlap) / max(len(wanted), 1),
            len(overlap) / max(len(entry["tokens"]), 1),
        )
        if score > best_score:
            best = entry
            best_score = score
    if best and best_score >= 0.75:
        return best
    return None


def class_file(group):
    if not group:
        return None
    normalized = normalize(group)
    match = re.search(r"\b([1-6])\s*o?\s*([ab])\b", normalized)
    if not match:
        return None
    grade, letter = match.groups()
    path = ROOT / "clases-pri" / f"Clases_PRI_{grade}{letter.upper()}.htm"
    return path if path.exists() else None


def safe_name(value):
    value = normalize(value).replace(" ", "-")
    return re.sub(r"[^a-z0-9-]+", "", value).strip("-") or "horario"


def render_pdf(browser, html_path, pdf_path):
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    url = html_path.resolve().as_uri()
    command = [
        browser,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path.resolve()}",
        url,
    ]
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    if not pdf_path.exists() or pdf_path.stat().st_size == 0:
        raise RuntimeError(f"No se generó el PDF: {pdf_path}")


def send_email(gmail_user, gmail_password, recipient, subject, body, attachments):
    message = EmailMessage()
    message["From"] = gmail_user
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)

    for attachment in attachments:
        data = attachment.read_bytes()
        message.add_attachment(data, maintype="application", subtype="pdf", filename=attachment.name)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(gmail_user, gmail_password)
        smtp.send_message(message)


def main():
    parser = argparse.ArgumentParser(description="Genera y envía PDFs de horarios de Primaria por Gmail.")
    parser.add_argument("--csv", default="private/users-primaria.csv", type=Path)
    parser.add_argument("--out", default="out/pdfs-primaria", type=Path)
    parser.add_argument("--send", action="store_true", help="Envía emails. Sin esto solo simula y genera PDFs.")
    parser.add_argument("--plan", action="store_true", help="Solo muestra el mapeo. No genera PDFs ni envía emails.")
    parser.add_argument("--only-email", help="Procesa solo este destinatario.")
    parser.add_argument("--limit", type=int, help="Limita el número de destinatarios procesados.")
    args = parser.parse_args()

    csv_path = args.csv if args.csv.is_absolute() else ROOT / args.csv
    out_dir = args.out if args.out.is_absolute() else ROOT / args.out
    rows = load_rows(csv_path)
    if args.only_email:
        rows = [row for row in rows if row["email"].strip().lower() == args.only_email.lower()]
    if args.limit:
        rows = rows[: args.limit]

    browser = None if args.plan else find_browser()
    prof_entries = professor_files()
    gmail_user = os.environ.get("GMAIL_USER")
    gmail_password = os.environ.get("GMAIL_APP_PASSWORD")
    if args.send and (not gmail_user or not gmail_password):
        raise RuntimeError("Define GMAIL_USER y GMAIL_APP_PASSWORD para enviar.")

    processed = 0
    skipped = 0
    for row in rows:
        name = row["Profesor"].strip()
        email = row["email"].strip()
        tutor = row.get("Tutor de Grupo", "").strip()
        attachments = []

        prof_match = match_professor(name, prof_entries)
        if prof_match:
            pdf = out_dir / f"profesor-{safe_name(name)}.pdf"
            if not args.plan:
                render_pdf(browser, prof_match["path"], pdf)
            attachments.append(pdf)
        else:
            print(f"AVISO: sin horario de profesor para {name}")

        class_path = class_file(tutor)
        if tutor and class_path:
            pdf = out_dir / f"grupo-{safe_name(tutor)}.pdf"
            if not args.plan:
                render_pdf(browser, class_path, pdf)
            attachments.append(pdf)
        elif tutor:
            print(f"AVISO: no encuentro horario de grupo para {name}: {tutor}")

        if not attachments:
            skipped += 1
            continue

        subject = "Horarios curso 2026-2027"
        body = "Adjunto se envían los horarios correspondientes al curso 2026-2027.\n\nUn saludo."
        if args.plan:
            print(f"PLAN: {email} -> {', '.join(path.name for path in attachments)}")
        elif args.send:
            send_email(gmail_user, gmail_password, email, subject, body, attachments)
            print(f"ENVIADO: {email} -> {', '.join(path.name for path in attachments)}")
        else:
            print(f"SIMULADO: {email} -> {', '.join(path.name for path in attachments)}")
        processed += 1

    print(f"Procesados: {processed}. Omitidos: {skipped}.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
