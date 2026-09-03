#!/usr/bin/env python3
import argparse
import html
import re
import subprocess
import tempfile
import unicodedata
from collections import defaultdict
from pathlib import Path


TEACHERS = {
    'Alba': ('Huergo Olagaray Alba', 'Profesores_Alba.htm'),
    'Ana': ('López Velasco Ana', 'Profesores_Ana2345.htm'),
    'Carmen Le.': ('León Miranda Carmen', 'Profesores_Car5.htm'),
    'Carlos': ('López López Carlos D', 'Profesores_Car6.htm'),
    'Carmen Lo.': ('López Carmen', 'Profesores_Carm.htm'),
    'Celia': ('Álvarez Marín Celia', 'Profesores_Celi.htm'),
    'David': ('Bueno Ruiz David', 'Profesores_Davi.htm'),
    'Elena': ('Rodríguez Casado Ele', 'Profesores_Ele2.htm'),
    'Guillermo': ('Bermejo Cruz Guiller', 'Profesores_Guil.htm'),
    'Hugo': ('González De La Puent', 'Profesores_Hugo.htm'),
    'Inma': ('Borraz Viver Inmacul', 'Profesores_Inma.htm'),
    'Ion': ('Ávila Pérez Ion', 'Profesores_Ion.htm'),
    'Jesús': ('Caballero Dávila Jes', 'Profesores_Jesfa.htm'),
    'Julio': ('Martínez González Ju', 'Profesores_Jul3.htm'),
    'Laura': ('De Pablos Alvarez La', 'Profesores_Lau2.htm'),
    'Lorena': ('Espiño Perez Lorena', 'Profesores_Lore.htm'),
    'Mª Jesús': ('Irigaray Murillo Mar', 'Profesores_Mar11.htm'),
    'María C.': ('Cortizo Ameal María', 'Profesores_Mar10.htm'),
    'María I.': ('Fernández Artazcoz M', 'Profesores_Maa_J.htm'),
    'Marcos': ('Ruiz Neira Marcos', 'Profesores_Marc.htm'),
    'Michel': ('Bibián Lamarca Miche', 'Profesores_Mich.htm'),
    'Nacho': ('Martínez González Ju', 'Profesores_Jua3.htm'),
    'Patricia': ('Ortiz Martínez Patri', 'Profesores_Pat2.htm'),
    'Ramón': ('Ruiz Lucendo Ramón', 'Profesores_Ramf3.htm'),
    'Susana': ('Fernández Martínez S', 'Profesores_Susa.htm'),
}
DAY_NAMES = {'Lu': 'Lunes', 'Ma': 'Martes', 'Mi': 'Miércoles', 'Ju': 'Jueves', 'Vi': 'Viernes'}
DAY_ORDER = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi']
COLOR_COUNT = 20


def normalize(value):
    value = unicodedata.normalize('NFD', value)
    return ''.join(char for char in value if unicodedata.category(char) != 'Mn').lower()


def js_hash(value):
    result = 0
    for char in value:
        result = ((result << 5) - result + ord(char)) & 0xFFFFFFFF
        if result & 0x80000000:
            result -= 0x100000000
    return abs(result)


def parse_pdf(pdf_path, pdftotext_bin):
    with tempfile.NamedTemporaryFile(suffix='.txt') as text_file:
        try:
            subprocess.run([pdftotext_bin, '-layout', str(pdf_path), text_file.name], check=True)
        except FileNotFoundError:
            raise SystemExit('No se encuentra pdftotext. Instala Poppler con: brew install poppler')
        lines = Path(text_file.name).read_text(encoding='utf-8', errors='replace').splitlines()

    teachers = sorted(TEACHERS, key=len, reverse=True)
    rows = defaultdict(list)
    group_pattern = re.compile(r'(?:4º ESO [AB]|ESO [1-4][AB]|BAC [12][AB])(?:,(?:4º ESO [AB]|ESO [1-4][AB]|BAC [12][AB]))*')
    row_pattern = re.compile(r'^\s*(Lu|Ma|Mi|Ju|Vi)\s+(\d{2}:\d{2})\s+(\d{2}:\d{2})\s+(.+)$')

    for line in lines:
        match = row_pattern.match(line.replace('\f', ''))
        if not match:
            continue
        day, start, end, rest = match.groups()
        teacher = next((name for name in teachers if rest.startswith(name)), None)
        if not teacher:
            continue
        rest = rest[len(teacher):].strip()
        group_match = group_pattern.search(rest)
        if not group_match:
            continue
        subject = rest[:group_match.start()].strip()
        groups = group_match.group(0).strip()
        room = rest[group_match.end():].strip()
        rows[teacher].append({'day': day, 'start': start, 'end': end, 'subject': subject, 'groups': groups, 'room': room})
    for teacher in rows:
        unique = {(lesson['day'], lesson['start'], lesson['end'], lesson['subject'], lesson['groups'], lesson['room']): lesson for lesson in rows[teacher]}
        rows[teacher] = list(unique.values())
    return rows


def lesson_cell(lesson):
    key = normalize(lesson['subject'] + '|' + lesson['groups'])
    color = (js_hash(key) % COLOR_COUNT) + 1
    details = [f"<b>{html.escape(lesson['subject'])}</b>", f"<i>{html.escape(lesson['groups'])}</i>"]
    if lesson['room']:
        details.append(f"<small>{html.escape(lesson['room'])}</small>")
    return f'<td class="lesson-color-{color}"><div class="lesson">{"<br>".join(details)}</div></td>'


def build_html(display_name, lessons):
    slots = sorted({(lesson['start'], lesson['end']) for lesson in lessons})
    by_slot = defaultdict(list)
    for lesson in lessons:
        by_slot[(lesson['day'], lesson['start'], lesson['end'])].append(lesson)

    header = ''.join(f'<th>{name}</th>' for name in ['Hora'] + [DAY_NAMES[day] for day in DAY_ORDER])
    body = []
    for start, end in slots:
        cells = [f'<th class="time">{start}<br>{end}</th>']
        for day in DAY_ORDER:
            day_lessons = by_slot.get((day, start, end), [])
            if len(day_lessons) == 1:
                cells.append(lesson_cell(day_lessons[0]))
            elif day_lessons:
                cells.append('<td class="lesson-stack">' + '<br>'.join(
                    html.escape(lesson['subject'] + ' ' + lesson['groups']) for lesson in day_lessons
                ) + '</td>')
            else:
                cells.append('<td></td>')
        body.append('<tr>' + ''.join(cells) + '</tr>')

    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Horario de {html.escape(display_name)}</title>
<link rel="stylesheet" href="untis.css">
</head>
<body class="teacher-timetable">
<main>
<div class="home-link-wrap"><a class="home-link" href="../index.html">&#8592; Volver al inicio</a></div>
<header class="schedule-header"><strong>COAS</strong><span>Curso 2026-2027</span><strong>Untis 2027</strong></header>
<h1>{html.escape(display_name)}</h1>
<div class="top-nav"><a href="Profesores.htm"><span class="nav-icon nav-home">&#127968;</span></a></div>
<div class="print-actions"><button type="button" class="print-action" onclick="window.print()">Descargar PDF</button><button type="button" class="print-action" onclick="window.print()">Imprimir</button></div>
<table border="3" rules="all" class="generated-timetable"><thead><tr>{header}</tr></thead><tbody>{''.join(body)}</tbody></table>
<footer>alcaste-lasfuentes.com</footer>
</main>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--pdftotext', default='pdftotext')
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    rows = parse_pdf(Path(args.pdf), args.pdftotext)
    for teacher, (display_name, filename) in TEACHERS.items():
        lessons = rows.get(teacher, [])
        if not lessons:
            print(f'Aviso: no hay registros para {teacher}')
            continue
        (output / filename).write_text(build_html(display_name, lessons), encoding='utf-8')
    print(f'Generados {sum(bool(rows.get(teacher)) for teacher in TEACHERS)} horarios de profesores en {output}')


if __name__ == '__main__':
    main()
