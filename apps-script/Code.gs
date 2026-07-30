const DEFAULT_SITE_BASE_URL = 'https://gecoas.github.io/untis';
const DEFAULT_SHEET_NAME = 'Primaria';

const PROFESSOR_TIMETABLES = [
  ['González Alonso Adrián', 'prof-pri/Profesores_Adri.htm'],
  ['Revilla Cernuda Ana María', 'prof-pri/Profesores_Ana5.htm'],
  ['Benali Bárbara', 'prof-pri/Profesores_Be1rb.htm'],
  ['Soto Araneta Charo', 'prof-pri/Profesores_Char.htm'],
  ['Fernández Domper Cristina', 'prof-pri/Profesores_Cri6.htm'],
  ['Vaquerizo García de Viedma Cristina', 'prof-pri/Profesores_Cri7.htm'],
  ['Bailly-Bailliere Torres-Pardo Gabriel', 'prof-pri/Profesores_Gabriel_BB.htm'],
  ['Bello Glenda', 'prof-pri/Profesores_Glen.htm'],
  ['García Corral Gonzalo', 'prof-pri/Profesores_Gonz.htm'],
  ['Iñigo Romera Iñigo Alberto', 'prof-pri/Profesores_If1ig.htm'],
  ['Fernández Castiella Juan Pablo', 'prof-pri/Profesores_Jua2.htm'],
  ['Palacios Herce Laura', 'prof-pri/Profesores_Lau4.htm'],
  ['Ruiz Neira Marcos', 'prof-pri/Profesores_Marc.htm'],
  ['Bibián Lamarca Michel', 'prof-pri/Profesores_Mich.htm'],
  ['Regaña Guerrero Monte', 'prof-pri/Profesores_Mont.htm'],
  ['Valverde Álvarez Patricia', 'prof-pri/Profesores_Pat6.htm'],
  ['Jiménez Navajas Raúl', 'prof-pri/Profesores_Rafal.htm'],
  ['Latorre Tobias Rocio', 'prof-pri/Profesores_Roci.htm'],
  ['Sáenz Garbayo Vanesa', 'prof-pri/Profesores_Van2.htm'],
  ['Mata Pons Wenceslao', 'prof-pri/Profesores_Wen.htm']
];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Enviar horarios PDF')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getRows() {
  return readPeople_().map(buildRow_);
}

function generatePreview(rowId) {
  const row = findRow_(rowId);
  const attachments = buildAttachments_(row);
  if (!attachments.length) {
    throw new Error('No hay ningún horario asociado a ' + row.profesor);
  }
  return attachments.map((attachment) => {
    const file = createOrReplacePdf_(attachment);
    return {
      label: attachment.label,
      fileName: file.getName(),
      url: file.getUrl()
    };
  });
}

function sendRow(rowId) {
  const row = findRow_(rowId);
  const attachments = buildAttachments_(row);
  if (!attachments.length) {
    throw new Error('No hay ningún horario asociado a ' + row.profesor);
  }
  const pdfBlobs = attachments.map((attachment) => createOrReplacePdf_(attachment).getBlob());
  GmailApp.sendEmail(
    row.email,
    'Horarios curso 2026-2027',
    'Adjunto se envían los horarios correspondientes al curso 2026-2027.\n\nUn saludo.',
    { attachments: pdfBlobs }
  );
  return {
    email: row.email,
    attachments: attachments.map((attachment) => attachment.fileName)
  };
}

function sendSelected(rowIds) {
  return rowIds.map((rowId) => sendRow(rowId));
}

function buildRow_(row) {
  const attachments = buildAttachments_(row);
  return {
    id: row.id,
    profesor: row.profesor,
    email: row.email,
    tutorDe: row.tutorDe,
    attachments: attachments.map((attachment) => ({
      label: attachment.label,
      path: attachment.path,
      fileName: attachment.fileName
    })),
    warnings: buildWarnings_(row, attachments)
  };
}

function readPeople_() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) {
    throw new Error('Falta Script Property SHEET_ID');
  }
  const sheetName = props.getProperty('SHEET_NAME') || DEFAULT_SHEET_NAME;
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('No existe la hoja: ' + sheetName);
  }
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map((value) => String(value).trim());
  const idxProfesor = headers.indexOf('Profesor');
  const idxEmail = headers.indexOf('email');
  const idxTutor = headers.indexOf('Tutor de Grupo');
  if (idxProfesor < 0 || idxEmail < 0 || idxTutor < 0) {
    throw new Error('La hoja debe tener columnas: Profesor, email, Tutor de Grupo');
  }
  return values
    .map((line, index) => ({
      id: String(index + 2),
      profesor: String(line[idxProfesor] || '').trim(),
      email: String(line[idxEmail] || '').trim(),
      tutorDe: String(line[idxTutor] || '').trim()
    }))
    .filter((row) => row.profesor && row.email);
}

function findRow_(rowId) {
  const row = readPeople_().find((entry) => entry.id === String(rowId));
  if (!row) {
    throw new Error('No encuentro la fila: ' + rowId);
  }
  return row;
}

function buildAttachments_(row) {
  const attachments = [];
  const professorMatch = matchProfessor_(row.profesor);
  if (professorMatch) {
    attachments.push({
      label: 'Horario profesor',
      path: professorMatch.path,
      fileName: 'profesor-' + safeName_(row.profesor) + '.pdf'
    });
  }
  const classPath = classPathFromTutor_(row.tutorDe);
  if (classPath) {
    attachments.push({
      label: 'Horario grupo tutor',
      path: classPath,
      fileName: 'grupo-' + safeName_(row.tutorDe) + '.pdf'
    });
  }
  return attachments;
}

function buildWarnings_(row, attachments) {
  const warnings = [];
  if (!matchProfessor_(row.profesor)) {
    warnings.push('No se ha encontrado horario de profesor');
  }
  if (row.tutorDe && !classPathFromTutor_(row.tutorDe)) {
    warnings.push('No se ha encontrado horario del grupo tutor');
  }
  if (!attachments.length) {
    warnings.push('No se enviará nada');
  }
  return warnings;
}

function matchProfessor_(name) {
  const wanted = tokens_(name);
  let best = null;
  let bestScore = 0;
  PROFESSOR_TIMETABLES.forEach(([title, path]) => {
    const available = tokens_(title);
    const overlap = wanted.filter((token) => available.indexOf(token) !== -1).length;
    const score = Math.max(overlap / Math.max(wanted.length, 1), overlap / Math.max(available.length, 1));
    if (score > bestScore) {
      bestScore = score;
      best = { title, path };
    }
  });
  return bestScore >= 0.75 ? best : null;
}

function classPathFromTutor_(value) {
  if (!value) return null;
  const match = normalize_(value).match(/\b([1-6])\s*o?\s*([ab])\b/);
  if (!match) return null;
  return 'clases-pri/Clases_PRI_' + match[1] + match[2].toUpperCase() + '.htm';
}

function createOrReplacePdf_(attachment) {
  const folder = getPdfFolder_();
  const existing = folder.getFilesByName(attachment.fileName);
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }
  const html = buildPrintableHtml_(attachment.path);
  const blob = Utilities
    .newBlob(html, 'text/html', attachment.fileName.replace(/\.pdf$/, '.html'))
    .getAs(MimeType.PDF)
    .setName(attachment.fileName);
  return folder.createFile(blob);
}

function buildPrintableHtml_(path) {
  const baseUrl = getBaseUrl_();
  const pageUrl = baseUrl + '/' + path;
  const folderPath = path.split('/').slice(0, -1).join('/');
  const cssUrl = baseUrl + '/' + folderPath + '/untis.css';
  let html = UrlFetchApp.fetch(pageUrl).getContentText('UTF-8');
  const css = UrlFetchApp.fetch(cssUrl).getContentText('UTF-8');
  html = html.replace(/<link\s+rel="stylesheet"\s+type="text\/css"\s+href="untis\.css"\s*>/i, '<style>' + css + '</style>');
  html = html.replace('</head>', '<base href="' + baseUrl + '/' + folderPath + '/"></head>');
  return html;
}

function getPdfFolder_() {
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('PDF_FOLDER_ID');
  if (folderId) {
    return DriveApp.getFolderById(folderId);
  }
  const folders = DriveApp.getFoldersByName('Horarios Untis PDF');
  return folders.hasNext() ? folders.next() : DriveApp.createFolder('Horarios Untis PDF');
}

function getBaseUrl_() {
  return (PropertiesService.getScriptProperties().getProperty('SITE_BASE_URL') || DEFAULT_SITE_BASE_URL).replace(/\/$/, '');
}

function normalize_(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function tokens_(value) {
  return normalize_(value).split(' ').filter((token) => token.length > 1);
}

function safeName_(value) {
  return normalize_(value).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'horario';
}
