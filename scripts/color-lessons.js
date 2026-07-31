const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = ['clases-pri', 'prof-pri', 'clases-eso', 'prof-eso'];
const COLOR_COUNT = 20;

function stripTags(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return stripTags(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hash(value) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = ((result << 5) - result + value.charCodeAt(index)) | 0;
  }
  return Math.abs(result);
}

function lessonKey(body, isProfessorPage) {
  const subjectMatch = body.match(/<B>([\s\S]*?)<\/B>/i);
  if (!subjectMatch) return '';
  const subject = normalize(subjectMatch[1]);
  if (!subject) return '';
  if (!isProfessorPage) return subject;

  const rest = body.slice(subjectMatch.index + subjectMatch[0].length);
  const rows = Array.from(rest.matchAll(/<TR><TD[^>]*>([\s\S]*?)<\/TD>\s*<\/TR>/gi))
    .map((match) => stripTags(match[1]))
    .filter(Boolean)
    .filter((text) => text.indexOf('Untis') === -1);
  return [subject, rows[0] || ''].filter(Boolean).join('|');
}

function addClass(attrs, colorClass) {
  let next = attrs.replace(/\sclass=("|')[^"']*\blesson-color-\d+\b[^"']*\1/gi, '');
  next = next.replace(/\sclass=("|')([^"']*)\1/i, (match, quote, classes) => {
    return ' class=' + quote + (classes + ' ' + colorClass).trim() + quote;
  });
  if (!/\sclass=("|')/i.test(next)) {
    next += ' class="' + colorClass + '"';
  }
  return next;
}

function colorFile(filePath) {
  const isProfessorPage = path.basename(path.dirname(filePath)).startsWith('prof-');
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/<TD([^>]*\bcolspan=\d+(?![^>]*\browspan=)[^>]*)>/gi, (match, attrs) => '<TD' + attrs.replace(/\sclass=("|')[^"']*\blesson-color-\d+\b[^"']*\1/gi, '') + '>');
  content = content.replace(/<TD([^>]*\bcolspan=\d+[^>]*\browspan=\d+[^>]*)>(\s*<TABLE>[\s\S]*?<\/TABLE>)<\/TD>/gi, (match, attrs, body) => {
    const key = lessonKey(body, isProfessorPage);
    if (!key) return match.replace(/\sclass=("|')[^"']*\blesson-color-\d+\b[^"']*\1/gi, '');
    const colorClass = 'lesson-color-' + ((hash(key) % COLOR_COUNT) + 1);
    return '<TD' + addClass(attrs, colorClass) + '>' + body + '</TD>';
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return 1;
  }
  return 0;
}

let changed = 0;
TARGETS.forEach((folder) => {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir)
    .filter((name) => name.endsWith('.htm'))
    .filter((name) => name !== 'Clases.htm' && name !== 'Profesores.htm')
    .forEach((name) => {
      changed += colorFile(path.join(dir, name));
    });
});

console.log('Horarios coloreados: ' + changed);
