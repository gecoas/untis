#!/usr/bin/env python3
import argparse
import re
from pathlib import Path


LATE_STARTS = {'15:05', '16:05'}


def remove_slots(path: Path) -> bool:
    content = path.read_text(encoding='utf-8', errors='replace')
    changed = False
    for start in LATE_STARTS:
        pattern = re.compile(
            rf'<TR>\s*<TD rowspan=2[^>]*><TABLE><TR><TD[^>]*><font[^>]*size="2"[^>]*>\s*{re.escape(start)}\s*</font>.*?</TD></TR></TABLE></TD>.*?</TR>\s*<TR>\s*</TR>',
            re.IGNORECASE | re.DOTALL,
        )
        content, count = pattern.subn('', content, count=1)
        changed = changed or bool(count)
    if changed:
        path.write_text(content, encoding='utf-8', newline='')
    return changed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--folder', required=True)
    args = parser.parse_args()
    folder = Path(args.folder)
    changed = 0
    for path in folder.glob('Clases_*.htm'):
        if re.search(r'Clases_ESO_[12][AB]\.htm$', path.name):
            continue
        changed += remove_slots(path)
    print(f'Eliminadas franjas finales en {changed} archivos de {folder}')


if __name__ == '__main__':
    main()
