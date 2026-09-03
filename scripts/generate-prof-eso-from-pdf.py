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
    'Julio': ('Novoa Somalo', 'Profesores_Jul3.htm'),
    'Laura': ('De Pablos Alvarez La', 'Profesores_Lau2.htm'),
    'Lorena': ('Espiño Perez Lorena', 'Profesores_Lore.htm'),
    'Mª Jesús': ('Fernández Artazcoz M', 'Profesores_Maa_J.htm'),
    'María C.': ('Cortizo Ameal María', 'Profesores_Mar10.htm'),
    'María I.': ('Irigaray Murillo Mar', 'Profesores_Mar11.htm'),
    'Marcos': ('Ruiz Neira Marcos', 'Profesores_Marc.htm'),
    'Michel': ('Bibián Lamarca Miche', 'Profesores_Mich.htm'),
    'Nacho': ('Martínez González Ju', 'Profesores_Jua3.htm'),
    'Patricia': ('Ortiz Martínez Patri', 'Profesores_Pat2.htm'),
    'Ramón': ('Ruiz Lucendo Ramón', 'Profesores_Ramf3.htm'),
    'Susana': ('Fernández Martínez S', 'Profesores_Susa.htm'),
}
DAY_NAMES = {'Lu': 'Lunes', 'Ma': 'Martes', 'Mi': 'Miércoles', 'Ju': 'Jueves', 'Vi': 'Viernes'}
DAY_ORDER = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi']
DAY_SLOTS = [
    ('08:15', '09:15'), ('09:15', '10:05'), ('10:05', '10:55'),
    ('10:55', '11:25'), ('11:25', '11:50'), ('11:50', '12:40'),
    ('12:40', '13:30'), ('13:30', '13:55'), ('13:55', '14:15'),
    ('13:30', '14:25'), ('14:15', '15:05'), ('15:05', '16:00'),
]
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


def extract_pdf_lines(pdf_path, pdftotext_bin):
    if pdftotext_bin:
        with tempfile.NamedTemporaryFile(suffix='.txt') as text_file:
            subprocess.run([pdftotext_bin, '-layout', str(pdf_path), text_file.name], check=True)
            return Path(text_file.name).read_text(encoding='utf-8', errors='replace').splitlines()

    try:
        from pypdf import PdfReader
    except ImportError:
        raise SystemExit('No hay pdftotext ni pypdf. Instala la alternativa Python con: python3 -m pip install --user pypdf')

    lines = []
    for page in PdfReader(str(pdf_path)).pages:
        try:
            text = page.extract_text(extraction_mode='layout')
        except TypeError:
            text = page.extract_text()
        lines.extend((text or '').splitlines())
    return lines


def load_stage_slots(class_folder):
    stage_slots = {'lower': set(), 'upper': set()}
    time_pattern = re.compile(r'<font\s+size=["\']?2["\']?\s+face=["\']Arial["\']?[^>]*>\s*(\d{1,2}:\d{2})\s*</font>', re.IGNORECASE)
    for path in Path(class_folder).glob('Clases_*.htm'):
        name = path.name
        stage = 'lower' if re.search(r'Clases_ESO_[12][AB]\.htm$', name) else 'upper'
        text = path.read_text(encoding='utf-8', errors='replace')
        times = time_pattern.findall(text)
        for start, end in zip(times[::2], times[1::2]):
            if (start, end) == ('16:05', '16:30'):
                continue
            stage_slots[stage].add((start.zfill(5), end.zfill(5)))
    if not stage_slots['lower'] or not stage_slots['upper']:
        return {'lower': set(DAY_SLOTS), 'upper': set(DAY_SLOTS)}
    return stage_slots


def parse_pdf(pdf_path, pdftotext_bin):
    lines = extract_pdf_lines(pdf_path, pdftotext_bin)

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
        if group_match:
            subject = rest[:group_match.start()].strip()
            groups = group_match.group(0).strip()
            room = rest[group_match.end():].strip()
        else:
            room_match = re.search(r'\s{2,}([A-Z][A-Z0-9.]+)$', rest)
            room = room_match.group(1) if room_match else ''
            subject = rest[:room_match.start()].strip() if room_match else rest
            groups = ''
        if not subject:
            continue
        rows[teacher].append({'day': day, 'start': start, 'end': end, 'subject': subject, 'groups': groups, 'room': room})
    for teacher in rows:
        unique = {(lesson['day'], lesson['start'], lesson['end'], lesson['subject'], lesson['groups'], lesson['room']): lesson for lesson in rows[teacher]}
        rows[teacher] = list(unique.values())
    return rows


def lesson_cell(lesson):
    key = normalize(lesson['subject'] + '|' + lesson['groups'])
    color = (js_hash(key) % COLOR_COUNT) + 1
    details = [f"<b>{html.escape(lesson['subject'])}</b>"]
    if lesson['groups']:
        details.append(f"<i>{html.escape(lesson['groups'])}</i>")
    if lesson['room']:
        details.append(f"<small>{html.escape(lesson['room'])}</small>")
    return f'<td class="lesson-color-{color}"><div class="lesson">{"<br>".join(details)}</div></td>'


def build_html(display_name, lessons, previous_file, next_file, stage_slots):
    groups = ','.join(lesson['groups'] for lesson in lessons)
    has_lower = bool(re.search(r'(?:ESO [12][AB])', groups))
    has_upper = bool(re.search(r'(?:ESO [34][AB]|4º ESO [AB]|BAC [12][AB])', groups))
    selected_slots = set()
    if has_lower:
        selected_slots.update(stage_slots['lower'])
    if has_upper or not selected_slots:
        selected_slots.update(stage_slots['upper'])
    slots = sorted(selected_slots | {(lesson['start'], lesson['end']) for lesson in lessons})
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

    previous_link = f'<A HREF="{previous_file}"><span class="nav-icon nav-prev">&#8592;</span></A>' if previous_file else ''
    next_link = f'<A HREF="{next_file}"><span class="nav-icon nav-next">&#8594;</span></A>' if next_file else ''
    return f'''<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="GENERATOR" content="Untis 2027">
<title>Untis 2027  Curso 2026-2027  COAS</title>
<link rel="stylesheet" type="text/css" href="untis.css">
</head>
<body class=tt>
<CENTER><div class="home-link-wrap"><a class="home-link" href="../index.html">&#8592; Volver al inicio</a></div><font size="3" face="Arial" color="#000000">
<TABLE border="0" cellpadding="1"><TR><TD rowspan="2" width="5"></TD><TD><b>COAS</b></TD><TD rowspan="2" width="5"></TD><TD>Curso 2026-2027</TD><TD rowspan="2" width="5"></TD><TD align="right"><b>Untis 2027</b></TD><TD rowspan="2" width="5"></TD></TR><TR><TD>ES-Leioa</TD><TD>Alcaste - Las Fuentes</TD><TD align="right">3/9/2026 19:00</TD></TR></TABLE><BR></font>
<font size="4" face="Arial"><B>{html.escape(display_name)}</B></font>
<div class="top-nav">{previous_link}<A HREF="Profesores.htm"><span class="nav-icon nav-home">&#127968;</span></A>{next_link}</div><div class="print-actions"><button type="button" class="print-action" onclick="window.print()">Descargar PDF</button><button type="button" class="print-action" onclick="window.print()">Imprimir</button></div><BR>
<TABLE border="3" rules="all" cellpadding="1" cellspacing="1"><TR><TD align="center">Hora</TD>{''.join(f'<TD colspan="1" align="center"><B>{name}</B></TD>' for name in [DAY_NAMES[day] for day in DAY_ORDER])}</TR>{''.join(body)}</TABLE>
<font size="3" face="Arial">alcaste-lasfuentes.com</font>
</CENTER>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--class-folder', default='')
    parser.add_argument('--pdftotext', default='pdftotext')
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    rows = parse_pdf(Path(args.pdf), args.pdftotext)
    stage_slots = load_stage_slots(args.class_folder) if args.class_folder else {'lower': set(DAY_SLOTS), 'upper': set(DAY_SLOTS)}
    teacher_items = list(TEACHERS.items())
    for index, (teacher, (display_name, filename)) in enumerate(teacher_items):
        lessons = rows.get(teacher, [])
        if not lessons:
            print(f'Aviso: no hay registros para {teacher}')
            continue
        previous_file = teacher_items[index - 1][1][1] if index else None
        next_file = teacher_items[index + 1][1][1] if index + 1 < len(teacher_items) else None
        (output / filename).write_text(build_html(display_name, lessons, previous_file, next_file, stage_slots), encoding='utf-8')
    print(f'Generados {sum(bool(rows.get(teacher)) for teacher in TEACHERS)} horarios de profesores en {output}')


if __name__ == '__main__':
    main()
