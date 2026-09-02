#!/usr/bin/env python3
import argparse
import re
import unicodedata
from pathlib import Path


TARGETS = ['clases-pri', 'prof-pri', 'clases-eso', 'prof-eso']
COLOR_COUNT = 20


def strip_tags(value: str) -> str:
    value = re.sub(r'<[^>]+>', ' ', value)
    replacements = {
        '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    }
    for old, new in replacements.items():
        value = re.sub(re.escape(old), new, value, flags=re.IGNORECASE)
    return re.sub(r'\s+', ' ', value).strip()


def normalize(value: str) -> str:
    value = unicodedata.normalize('NFD', strip_tags(value))
    return ''.join(char for char in value if unicodedata.category(char) != 'Mn').lower()


def js_hash(value: str) -> int:
    result = 0
    for char in value:
        result = ((result << 5) - result + ord(char)) & 0xFFFFFFFF
        if result & 0x80000000:
            result -= 0x100000000
    return abs(result)


def lesson_key(body: str, is_professor_page: bool) -> str:
    subject_match = re.search(r'<B>([\s\S]*?)</B>', body, flags=re.IGNORECASE)
    if not subject_match:
        return ''
    subject = normalize(subject_match.group(1))
    if not subject:
        return ''
    if not is_professor_page:
        return subject
    rest = body[subject_match.end():]
    rows = [
        strip_tags(match.group(1))
        for match in re.finditer(r'<TR><TD[^>]*>([\s\S]*?)</TD>\s*</TR>', rest, flags=re.IGNORECASE)
    ]
    rows = [row for row in rows if row and 'Untis' not in row]
    return '|'.join(part for part in [subject, rows[0] if rows else ''] if part)


def add_class(attrs: str, color_class: str) -> str:
    attrs = re.sub(r'\sclass=("|\')[^"\']*\blesson-color-\d+\b[^"\']*\1', '', attrs, flags=re.IGNORECASE)

    def replace_class(match: re.Match) -> str:
        quote = match.group(1)
        classes = (match.group(2) + ' ' + color_class).strip()
        return f' class={quote}{classes}{quote}'

    attrs, count = re.subn(r'\sclass=("|\')([^"\']*)\1', replace_class, attrs, count=1, flags=re.IGNORECASE)
    if count == 0:
        attrs += f' class="{color_class}"'
    return attrs


def color_file(path: Path) -> bool:
    is_professor_page = path.parent.name.startswith('prof-')
    content = path.read_text(encoding='utf-8')
    original = content
    content = re.sub(
        r'<TD([^>]*\bcolspan=\d+(?![^>]*\browspan=)[^>]*)>',
        lambda match: '<TD' + re.sub(r'\sclass=("|\')[^"\']*\blesson-color-\d+\b[^"\']*\1', '', match.group(1), flags=re.IGNORECASE) + '>',
        content,
        flags=re.IGNORECASE,
    )

    def replace_lesson(match: re.Match) -> str:
        attrs = match.group(1)
        body = match.group(2)
        key = lesson_key(body, is_professor_page)
        if not key:
            return re.sub(r'\sclass=("|\')[^"\']*\blesson-color-\d+\b[^"\']*\1', '', match.group(0), flags=re.IGNORECASE)
        color_class = f'lesson-color-{(js_hash(key) % COLOR_COUNT) + 1}'
        return '<TD' + add_class(attrs, color_class) + '>' + body + '</TD>'

    content = re.sub(
        r'<TD([^>]*\bcolspan=\d+[^>]*\browspan=\d+[^>]*)>(\s*<TABLE>[\s\S]*?</TABLE>)</TD>',
        replace_lesson,
        content,
        flags=re.IGNORECASE,
    )
    if content != original:
        path.write_text(content, encoding='utf-8', newline='')
        return True
    return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default=str(Path(__file__).resolve().parent.parent))
    args = parser.parse_args()
    root = Path(args.root)
    changed = 0
    for folder in TARGETS:
        directory = root / folder
        if not directory.is_dir():
            continue
        for path in directory.glob('*.htm'):
            if path.name in {'Clases.htm', 'Profesores.htm'}:
                continue
            changed += int(color_file(path))
    print(f'Horarios coloreados: {changed}')


if __name__ == '__main__':
    main()
