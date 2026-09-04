#!/usr/bin/env python3
import argparse
import re
from pathlib import Path


CODES = [
    0x00E1, 0x00E9, 0x00ED, 0x00F3, 0x00FA,
    0x00C1, 0x00C9, 0x00CD, 0x00D3, 0x00DA,
    0x00F1, 0x00D1, 0x00FC, 0x00DC, 0x00BA, 0x00AA,
]


def read_html(path: Path) -> str:
    data = path.read_bytes()
    try:
        return data.decode('utf-8')
    except UnicodeDecodeError:
        return data.decode('cp1252')


def fix_mojibake(content: str) -> str:
    content = content.replace('Ã‚º', 'º').replace('Ã‚ª', 'ª').replace('Âº', 'º').replace('Âª', 'ª')
    content = re.sub(r'([1-4])� ESO', r'\1º ESO', content)
    content = re.sub(r'([12])� Bachillerato', r'\1º Bachillerato', content)
    content = content.replace('Mi�rcoles', 'Miércoles')
    replacements = {
        'Franc�s': 'Francés', 'F�sica': 'Física', 'Qu�mica': 'Química',
        'Matem�ticas': 'Matemáticas', 'Biolog�a': 'Biología', 'Ingl�s': 'Inglés',
        'Religi�n': 'Religión', 'Ed. F�sica': 'Ed. Física', 'M�sica': 'Música',
        'Pl�stica': 'Plástica', 'Geograf�a': 'Geografía', 'Orientaci�n': 'Orientación',
        'Dibujo T�cnico': 'Dibujo Técnico', 'H� Filosof�a': 'Hª Filosofía', 'H� Mundo': 'Hª Mundo', 'Filosof�a': 'Filosofía',
        'Econom�a': 'Economía', 'Programaci�n': 'Programación', 'Mar�a': 'María',
        'M� Jesús': 'Mª Jesús', 'Jes�s': 'Jesús', 'Geolog�a': 'Geología',
        'Tutor�a': 'Tutoría', 'Lat�n': 'Latín', 'Ram�n': 'Ramón', 'Historia Espa�a': 'Historia España',
        'Gesti�n': 'Gestión',
    }
    for bad, good in replacements.items():
        content = content.replace(bad, good)
    for code in CODES:
        good = chr(code)
        bad = good
        for _ in range(3):
            bad = bad.encode('utf-8').decode('cp1252', errors='replace')
            content = content.replace(bad, good)
    return content


def prepare_file(path: Path) -> None:
    content = read_html(path)

    if 'untis.css' not in content:
        content = content.replace('</head>', '<link rel="stylesheet" type="text/css" href="untis.css">\n</head>')

    is_index = path.stem in {'Clases', 'Profesores'}
    if is_index and 'home-link' not in content:
        home_link = "<CENTER><div class='home-link-wrap'><a class='home-link' href='../index.html'>&#8592; Volver al inicio</a></div>"
        content = content.replace('<CENTER>', home_link, 1)

    content = re.sub('charset=iso-8859-1', 'charset=utf-8', content, flags=re.IGNORECASE)
    content = fix_mojibake(content)
    content = re.sub(r'<img\s+src="GpPrev\.gif"[^>]*>', '<span class="nav-icon nav-prev">&#8592;</span>', content, flags=re.IGNORECASE)
    content = re.sub(r'<img\s+src="GpIndex\.gif"[^>]*>', '<span class="nav-icon nav-home">&#127968;</span>', content, flags=re.IGNORECASE)
    content = re.sub(r'<img\s+src="GpNext\.gif"[^>]*>', '<span class="nav-icon nav-next">&#8594;</span>', content, flags=re.IGNORECASE)

    if not is_index and 'nav-icon' in content and 'top-nav' not in content:
        nav_links = re.findall(r'<A HREF="[^"]+"><span class="nav-icon [^"]+">.*?</span></A>', content, flags=re.IGNORECASE)
        if nav_links:
            nav_html = '<div class="top-nav">' + ''.join(nav_links) + '</div>'
            content = re.sub(r'(</font>\s*)<BR><TABLE border="3"', r'\1' + nav_html + '<BR><TABLE border="3"', content, count=1, flags=re.IGNORECASE)

    if not is_index and 'top-nav' in content and 'print-actions' not in content:
        print_html = '<div class="print-actions"><button type="button" class="print-action" onclick="window.print()">Descargar PDF</button><button type="button" class="print-action" onclick="window.print()">Imprimir</button></div>'
        content = content.replace('</div><BR><TABLE border="3"', '</div>' + print_html + '<BR><TABLE border="3"', 1)

    path.write_text(content, encoding='utf-8', newline='')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--folder', required=True)
    args = parser.parse_args()
    folder = Path(args.folder)
    if not folder.is_dir():
        raise SystemExit(f'No existe la carpeta: {folder}')
    files = list(folder.glob('*.htm'))
    for path in files:
        prepare_file(path)
    print(f'Preparados {len(files)} archivos en {folder}')


if __name__ == '__main__':
    main()
