const DEFAULT_SITE_BASE_URL = 'https://gecoas.github.io/untis';
const DEFAULT_SHEET_NAMES = ['Primaria', 'ESO/Bach'];

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
  ['San Miguel Nacho', 'prof-pri/Profesores_Nacho.htm'],
  ['Valverde Álvarez Patricia', 'prof-pri/Profesores_Pat6.htm'],
  ['Jiménez Navajas Raúl', 'prof-pri/Profesores_Rafal.htm'],
  ['Latorre Tobias Rocio', 'prof-pri/Profesores_Roci.htm'],
  ['Sáenz Garbayo Vanesa', 'prof-pri/Profesores_Van2.htm'],
  ['Mata Pons Wenceslao', 'prof-pri/Profesores_Wen.htm'],
  ['Huergo Olagaray Alba', 'prof-eso/Profesores_Alba.htm'],
  ['López Velasco Ana', 'prof-eso/Profesores_Ana2345.htm'],
  ['León Miranda Carmen', 'prof-eso/Profesores_Car5.htm'],
  ['López López Carlos D', 'prof-eso/Profesores_Car6.htm'],
  ['López Carmen', 'prof-eso/Profesores_Carm.htm'],
  ['Álvarez Marín Celia', 'prof-eso/Profesores_Celi.htm'],
  ['Bueno Ruiz David', 'prof-eso/Profesores_Davi.htm'],
  ['Rodríguez Casado Ele', 'prof-eso/Profesores_Ele2.htm'],
  ['Bermejo Cruz Guiller', 'prof-eso/Profesores_Guil.htm'],
  ['González De La Puent', 'prof-eso/Profesores_Hugo.htm'],
  ['Borraz Viver Inmacul', 'prof-eso/Profesores_Inma.htm'],
  ['Ávila Pérez Ion', 'prof-eso/Profesores_Ion.htm'],
  ['Caballero Dávila Jes', 'prof-eso/Profesores_Jesfa.htm'],
  ['Martínez González Ju', 'prof-eso/Profesores_Jua3.htm'],
  ['De Pablos Alvarez La', 'prof-eso/Profesores_Lau2.htm'],
  ['Espiño Perez Lorena', 'prof-eso/Profesores_Lore.htm'],
  ['Fernández Artazcoz M', 'prof-eso/Profesores_Maa_J.htm'],
  ['Cortizo Ameal María', 'prof-eso/Profesores_Mar10.htm'],
  ['Irigaray Murillo Mar', 'prof-eso/Profesores_Mar11.htm'],
  ['Ruiz Neira Marcos', 'prof-eso/Profesores_Marc.htm'],
  ['Bibián Lamarca Miche', 'prof-eso/Profesores_Mich.htm'],
  ['García Suarez Pablo', 'prof-eso/Profesores_Pab2.htm'],
  ['Ortiz Martínez Patri', 'prof-eso/Profesores_Pat2.htm'],
  ['Ruiz Lucendo Ramón', 'prof-eso/Profesores_Ramf3.htm'],
  ['Fernández Martínez S', 'prof-eso/Profesores_Susa.htm']
];

const CLASS_TIMETABLES = [
  ['1º Primaria A', 'clases-pri/Clases_PRI_1A.htm'],
  ['1º Primaria B', 'clases-pri/Clases_PRI_1B.htm'],
  ['2º Primaria A', 'clases-pri/Clases_PRI_2A.htm'],
  ['2º Primaria B', 'clases-pri/Clases_PRI_2B.htm'],
  ['3º Primaria A', 'clases-pri/Clases_PRI_3A.htm'],
  ['3º Primaria B', 'clases-pri/Clases_PRI_3B.htm'],
  ['4º Primaria A', 'clases-pri/Clases_PRI_4A.htm'],
  ['4º Primaria B', 'clases-pri/Clases_PRI_4B.htm'],
  ['5º Primaria A', 'clases-pri/Clases_PRI_5A.htm'],
  ['5º Primaria B', 'clases-pri/Clases_PRI_5B.htm'],
  ['6º Primaria A', 'clases-pri/Clases_PRI_6A.htm'],
  ['6º Primaria B', 'clases-pri/Clases_PRI_6B.htm'],
  ['1º ESO A', 'clases-eso/Clases_ESO_1A.htm'],
  ['1º ESO B', 'clases-eso/Clases_ESO_1B.htm'],
  ['2º ESO A', 'clases-eso/Clases_ESO_2A.htm'],
  ['2º ESO B', 'clases-eso/Clases_ESO_2B.htm'],
  ['3º ESO A', 'clases-eso/Clases_ESO_3A.htm'],
  ['3º ESO B', 'clases-eso/Clases_ESO_3B.htm'],
  ['4º ESO A', 'clases-eso/Clases_ESO_4A.htm'],
  ['4º ESO B', 'clases-eso/Clases_ESO_4B.htm'],
  ['1º Bachillerato A', 'clases-eso/Clases_BAC_1A.htm'],
  ['1º Bachillerato B', 'clases-eso/Clases_BAC_1B.htm'],
  ['2º Bachillerato A', 'clases-eso/Clases_BAC_2A.htm'],
  ['2º Bachillerato B', 'clases-eso/Clases_BAC_2B.htm']
];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Enviar horarios PDF')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getRows() {
  return {
    rows: readPeople_().map(buildRow_),
    professorOptions: PROFESSOR_TIMETABLES.map(([title, path]) => ({ title, path })),
    classOptions: CLASS_TIMETABLES.map(([title, path]) => ({ title, path }))
  };
}

function generatePreview(rowId, overrides) {
  const row = findRow_(rowId);
  const attachments = buildAttachments_(row, overrides);
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

function sendRow(rowId, overrides) {
  const row = findRow_(rowId);
  const attachments = buildAttachments_(row, overrides);
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

function sendSelected(items) {
  return items.map((item) => sendRow(item.rowId, item.overrides));
}

function buildRow_(row) {
  const professorMatch = matchProfessor_(row.profesor);
  const classPath = classPathFromTutor_(row.tutorDe);
  const attachments = buildAttachments_(row, {
    professorPath: professorMatch ? professorMatch.path : '',
    classPath: classPath || ''
  });
  return {
    id: row.id,
    sheetName: row.sheetName,
    profesor: row.profesor,
    email: row.email,
    tutorDe: row.tutorDe,
    selectedProfessorPath: professorMatch ? professorMatch.path : '',
    selectedClassPath: classPath || '',
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
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  return getSheetNames_().flatMap((sheetName) => readPeopleFromSheet_(spreadsheet, sheetName));
}

function getSheetNames_() {
  const value = PropertiesService.getScriptProperties().getProperty('SHEET_NAMES');
  if (!value) {
    return DEFAULT_SHEET_NAMES;
  }
  return value.split(',').map((name) => name.trim()).filter(Boolean);
}

function readPeopleFromSheet_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
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
      id: sheetName + '!' + String(index + 2),
      sheetName,
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

function buildAttachments_(row, overrides) {
  overrides = overrides || {};
  const attachments = [];
  const professorPath = Object.prototype.hasOwnProperty.call(overrides, 'professorPath')
    ? overrides.professorPath
    : (matchProfessor_(row.profesor) || {}).path;
  if (professorPath) {
    findProfessorOption_(professorPath);
    attachments.push({
      label: 'Horario profesor',
      path: professorPath,
      fileName: 'profesor-' + safeName_(row.profesor) + '.pdf'
    });
  }
  const classPath = Object.prototype.hasOwnProperty.call(overrides, 'classPath')
    ? overrides.classPath
    : classPathFromTutor_(row.tutorDe);
  if (classPath) {
    findClassOption_(classPath);
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

function findProfessorOption_(path) {
  const match = PROFESSOR_TIMETABLES.find((entry) => entry[1] === path);
  if (!match) {
    throw new Error('Archivo de profesor no permitido: ' + path);
  }
  return { title: match[0], path: match[1] };
}

function findClassOption_(path) {
  const match = CLASS_TIMETABLES.find((entry) => entry[1] === path);
  if (!match) {
    throw new Error('Archivo de grupo no permitido: ' + path);
  }
  return { title: match[0], path: match[1] };
}

function matchProfessor_(name) {
  const wanted = tokens_(name);
  let best = null;
  let bestScore = 0;
  PROFESSOR_TIMETABLES.forEach(([title, path]) => {
    const available = tokens_(title);
    const overlap = wanted.filter((token) => available.some((candidate) => tokenMatches_(token, candidate))).length;
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
  const normalized = normalize_(value);
  let match = normalized.match(/\b([1-6])\s*o?\s*([ab])\b/);
  if (match && normalized.indexOf('primaria') !== -1) {
    return 'clases-pri/Clases_PRI_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  match = normalized.match(/\b([1-4])\s*o?\s*eso\s*([ab])\b/) || normalized.match(/\b([1-4])\s*o?\s*([ab])\s*eso\b/);
  if (match) {
    return 'clases-eso/Clases_ESO_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  match = normalized.match(/\b([12])\s*o?\s*(?:bachillerato|bach|bac)\s*([ab])\b/) || normalized.match(/\b(?:bachillerato|bach|bac)\s*([12])\s*o?\s*([ab])\b/);
  if (match) {
    return 'clases-eso/Clases_BAC_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  const classMatch = matchClass_(value);
  return classMatch ? classMatch.path : null;
}

function matchClass_(name) {
  const wanted = tokens_(name);
  let best = null;
  let bestScore = 0;
  CLASS_TIMETABLES.forEach(([title, path]) => {
    const available = tokens_(title);
    const overlap = wanted.filter((token) => available.some((candidate) => tokenMatches_(token, candidate))).length;
    const score = Math.max(overlap / Math.max(wanted.length, 1), overlap / Math.max(available.length, 1));
    if (score > bestScore) {
      bestScore = score;
      best = { title, path };
    }
  });
  return bestScore >= 0.75 ? best : null;
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

function tokenMatches_(left, right) {
  if (left === right) return true;
  if (left.length < 3 || right.length < 3) return false;
  return left.indexOf(right) === 0 || right.indexOf(left) === 0;
}

function safeName_(value) {
  return normalize_(value).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'horario';
}
