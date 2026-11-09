const DEFAULT_SITE_BASE_URL = 'https://gecoas.github.io/untis';
const HORARIOS_WEB_BASE_URL = 'https://lasfuentes-alcaste.com/horarios';
const HORARIOS_WEB_DIRECTORY_URL = HORARIOS_WEB_BASE_URL + '/api_profesores_correos.php?colegio=ALF';
const DEFAULT_SHEET_NAMES = ['Primaria', 'ESO/Bach'];
const DEFAULT_EMAIL_BODY = 'Te adjunto tu/s horario/s correspondientes al curso 2026-2027. Faltan por añadir los encargos, tutorías aula de convivencia, etc. Lo añadiré cuando tengamos cerrada la versión definitiva. Un saludo.';

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
  ['Borraz Viver Inmaculada', 'prof-pri/Profesores_Inma.htm'],
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
  ['Novoa Somalo', 'prof-eso/Profesores_Jul3.htm'],
  ['De Pablos Alvarez La', 'prof-eso/Profesores_Lau2.htm'],
  ['Espiño Perez Lorena', 'prof-eso/Profesores_Lore.htm'],
  ['Fernández Artazcoz M', 'prof-eso/Profesores_Maa_J.htm'],
  ['Cortizo Ameal María', 'prof-eso/Profesores_Mar10.htm'],
  ['Irigaray Murillo Mar', 'prof-eso/Profesores_Mar11.htm'],
  ['Ruiz Neira Marcos', 'prof-eso/Profesores_Marc.htm'],
  ['Bibián Lamarca Miche', 'prof-eso/Profesores_Mich.htm'],
  ['Ortiz Martínez Patri', 'prof-eso/Profesores_Pat2.htm'],
  ['Ruiz Lucendo Ramón', 'prof-eso/Profesores_Ramf3.htm'],
  ['Fernández Martínez S', 'prof-eso/Profesores_Susa.htm'],
  ['Carrera Romero Jorda', 'prof-eso/Profesores_Jord.htm']
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
  const professorTimetables = getProfessorTimetables_();
  const professorDirectory = getProfessorDirectory_();
  return {
    rows: readPeople_().map((row) => buildRow_(row, professorTimetables, professorDirectory)),
    professorOptions: professorTimetables.map(([title, path]) => ({ title, path })),
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

function sendRow(rowId, overrides, emailBody) {
  const row = findRow_(rowId);
  const attachments = buildAttachments_(row, overrides);
  if (!attachments.length) {
    throw new Error('No hay ningún horario asociado a ' + row.profesor);
  }
  const pdfBlobs = attachments.map((attachment) => createOrReplacePdf_(attachment).getBlob());
  GmailApp.sendEmail(
    row.email,
    'Horarios curso 2026-2027',
    normalizeEmailBody_(emailBody),
    { attachments: pdfBlobs }
  );
  return {
    email: row.email,
    attachments: attachments.map((attachment) => attachment.fileName)
  };
}

function sendSelected(items, emailBody) {
  return items.map((item) => sendRow(item.rowId, item.overrides, emailBody));
}

function normalizeEmailBody_(emailBody) {
  const body = String(emailBody || DEFAULT_EMAIL_BODY).trim();
  if (!body) {
    throw new Error('El cuerpo del correo no puede estar vacío');
  }
  return body;
}

function buildRow_(row, professorTimetables, professorDirectory) {
  const professorMatch = matchProfessor_(row.profesor, row.sheetName, professorTimetables, professorDirectory, row.email);
  const classPath = classPathFromTutor_(row.tutorDe, row.sheetName);
  const attachments = buildAttachments_(row, {
    professorPath: professorMatch ? professorMatch.path : '',
    classPath: classPath || ''
  }, professorTimetables);
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
    warnings: buildWarnings_(row, attachments, professorTimetables, professorDirectory)
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

function buildAttachments_(row, overrides, professorTimetables) {
  overrides = overrides || {};
  const attachments = [];
  const professorPath = Object.prototype.hasOwnProperty.call(overrides, 'professorPath')
    ? overrides.professorPath
    : (matchProfessor_(row.profesor, row.sheetName, professorTimetables) || {}).path;
  if (professorPath) {
    findProfessorOption_(professorPath);
    attachments.push({
      label: 'Horario profesor',
      path: professorPath,
      email: row.email,
      fileName: 'profesor-' + safeName_(row.profesor) + '.pdf'
    });
  }
  const classPath = Object.prototype.hasOwnProperty.call(overrides, 'classPath')
    ? overrides.classPath
    : classPathFromTutor_(row.tutorDe, row.sheetName);
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

function buildWarnings_(row, attachments, professorTimetables, professorDirectory) {
  const warnings = [];
  if (!matchProfessor_(row.profesor, row.sheetName, professorTimetables, professorDirectory, row.email)) {
    warnings.push('No se ha encontrado horario de profesor');
  }
  if (row.tutorDe && !classPathFromTutor_(row.tutorDe, row.sheetName)) {
    warnings.push('No se ha encontrado horario del grupo tutor');
  }
  if (!attachments.length) {
    warnings.push('No se enviará nada');
  }
  return warnings;
}

function findProfessorOption_(path) {
  const match = getProfessorTimetables_().find((entry) => entry[1] === path);
  if (!match) {
    throw new Error('Archivo de profesor no permitido: ' + path);
  }
  return { title: match[0], path: match[1] };
}


function getProfessorDirectory_() {
  const payload = JSON.parse(fetchText_(HORARIOS_WEB_DIRECTORY_URL));
  return payload.directory || [];
}

function getProfessorTimetables_() {
  const discovered = [];
  const seen = {};
  PROFESSOR_TIMETABLES.forEach((entry) => {
    seen[entry[1]] = true;
    discovered.push(entry);
  });
  ['prof-pri/Profesores.htm', 'prof-eso/Profesores.htm'].forEach((indexPath) => {
    const html = fetchText_(getBaseUrl_() + '/' + indexPath);
    const folder = indexPath.split('/')[0];
    const links = html.matchAll(/<A\s+HREF="(Profesores_[^"]+\.htm)">\s*([^<]+?)\s*<\/A>/gi);
    for (const match of links) {
      const path = folder + '/' + match[1];
      if (!seen[path]) {
        seen[path] = true;
        discovered.push([match[2].trim(), path]);
      }
    }
  });
  return discovered;
}

function findClassOption_(path) {
  const match = CLASS_TIMETABLES.find((entry) => entry[1] === path);
  if (!match) {
    throw new Error('Archivo de grupo no permitido: ' + path);
  }
  return { title: match[0], path: match[1] };
}

function matchProfessor_(name, sheetName, timetables, directory, email) {
  const directoryEntry = (directory || []).find((entry) =>
    String(entry.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
  );
  const wantedNames = [tokens_(name)];
  if (directoryEntry && directoryEntry.scheduleName) wantedNames.push(tokens_(directoryEntry.scheduleName));
  let best = null;
  let bestScore = 0;
  filterTimetablesForSheet_(timetables || getProfessorTimetables_(), sheetName).forEach(([title, path]) => {
    const available = tokens_(title);
    const score = Math.max(...wantedNames.map((wanted) => {
      const overlap = wanted.filter((token) => available.some((candidate) => tokenMatches_(token, candidate))).length;
      return Math.max(overlap / Math.max(wanted.length, 1), overlap / Math.max(available.length, 1));
    }));
    if (score > bestScore) {
      bestScore = score;
      best = { title, path };
    }
  });
  return bestScore >= 0.75 ? best : null;
}

function classPathFromTutor_(value, sheetName) {
  if (!value) return null;
  const normalized = normalize_(value);
  let match = normalized.match(/\b([1-6])\s*(?:o|a)?\s*primaria\s*([ab])\b/) || normalized.match(/\b([1-6])\s*(?:o|a)?\s*([ab])\s*primaria\b/) || normalized.match(/\b([1-6])\s*(?:o|a)?\s*([ab])\b/);
  if (match && normalized.indexOf('primaria') !== -1 && isPrimarySheet_(sheetName)) {
    return 'clases-pri/Clases_PRI_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  match = normalized.match(/\b([1-4])\s*(?:o|a)?\s*eso\s*([ab])\b/) || normalized.match(/\b([1-4])\s*(?:o|a)?\s*([ab])\s*eso\b/);
  if (match && isSecondarySheet_(sheetName)) {
    return 'clases-eso/Clases_ESO_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  match = normalized.match(/\b([12])\s*(?:o|a)?\s*(?:bachillerato|bahcillerato|bach|bac)\s*([ab])\b/) || normalized.match(/\b([12])\s*(?:o|a)?\s*([ab])\s*(?:bachillerato|bahcillerato|bach|bac)\b/) || normalized.match(/\b(?:bachillerato|bahcillerato|bach|bac)\s*([12])\s*(?:o|a)?\s*([ab])\b/);
  if (match && isSecondarySheet_(sheetName)) {
    return 'clases-eso/Clases_BAC_' + match[1] + match[2].toUpperCase() + '.htm';
  }
  const classMatch = matchClass_(value, sheetName);
  return classMatch ? classMatch.path : null;
}

function matchClass_(name, sheetName) {
  const wanted = tokens_(name);
  let best = null;
  let bestScore = 0;
  filterTimetablesForSheet_(CLASS_TIMETABLES, sheetName).forEach(([title, path]) => {
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

function filterTimetablesForSheet_(timetables, sheetName) {
  if (isPrimarySheet_(sheetName)) {
    return timetables.filter((entry) => entry[1].indexOf('-pri/') !== -1);
  }
  if (isSecondarySheet_(sheetName)) {
    return timetables.filter((entry) => entry[1].indexOf('-eso/') !== -1);
  }
  return timetables;
}

function isPrimarySheet_(sheetName) {
  return normalize_(sheetName).indexOf('primaria') !== -1;
}

function isSecondarySheet_(sheetName) {
  const normalized = normalize_(sheetName);
  return normalized.indexOf('eso') !== -1 || normalized.indexOf('bach') !== -1;
}

function createOrReplacePdf_(attachment) {
  const folder = getPdfFolder_();
  const existing = folder.getFilesByName(attachment.fileName);
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }
  const html = buildPrintableHtml_(attachment);
  const blob = Utilities
    .newBlob(html, 'text/html', attachment.fileName.replace(/\.pdf$/, '.html'))
    .getAs(MimeType.PDF)
    .setName(attachment.fileName);
  return folder.createFile(blob);
}

function buildPrintableHtml_(attachment) {
  return buildWebScheduleHtml_(attachment);
}


function buildWebScheduleHtml_(attachment) {
  const path = attachment.path;
  const target = path.indexOf('prof-') === 0
    ? { type: 'teacher', title: findProfessorOption_(path).title, email: attachment.email }
    : { type: 'group', title: findClassOption_(path).title };
  const payload = JSON.parse(fetchText_(HORARIOS_WEB_BASE_URL + '/api_horarios.php?colegio=ALF'));
  const sessions = payload.data || [];
  if (target.type === 'teacher') {
    const directoryEntry = getProfessorDirectory_().find((entry) =>
      String(entry.email || '').trim().toLowerCase() === String(target.email || '').trim().toLowerCase()
    );
    if (directoryEntry && directoryEntry.scheduleName) target.scheduleName = directoryEntry.scheduleName;
  }
  const matchingSessions = target.type === 'group'
    ? sessions.filter((session) => normalize_(session.Grupo_Nombre) === normalize_(target.title))
    : sessions.filter((session) => session.Persona_Guid === findTeacherGuid_(sessions, target.scheduleName || target.title, path));
  if (!matchingSessions.length) {
    throw new Error('No hay datos en la web de horarios para ' + target.title);
  }
  const slots = sortScheduleSlots_(matchingSessions.map((session) => session.sesion_horaDesde + '-' + session.sesion_horaHasta));
  const days = [
    ['Monday', 'Lunes'], ['Tuesday', 'Martes'], ['Wednesday', 'Miércoles'],
    ['Thursday', 'Jueves'], ['Friday', 'Viernes']
  ];
  let table = '<table class="schedule-table"><caption>' + escapeHtml_(target.title) + '</caption><thead><tr><th>Hora</th>';
  days.forEach((day) => { table += '<th>' + day[1] + '</th>'; });
  table += '</tr></thead><tbody>';
  slots.forEach((slot) => {
    const times = slot.split('-');
    table += '<tr><th>' + escapeHtml_(times[0]) + '<br>' + escapeHtml_(times[1]) + '</th>';
    days.forEach((day) => {
      const cellSessions = matchingSessions.filter((session) =>
        session.sesion_diaSemana === day[0] &&
        session.sesion_horaDesde + '-' + session.sesion_horaHasta === slot
      );
      if (!cellSessions.length) {
        table += '<td class="empty"></td>';
        return;
      }
      const first = cellSessions[0];
      const colorKey = target.type === 'group' ? first.Materia_Nombre : first.Grupo_Nombre;
      table += '<td class="session-cell" style="background-color:' + scheduleColor_(colorKey) + ' !important">';
      const unique = {};
      cellSessions.forEach((session) => {
        const subject = session.Materia_Nombre || 'Sin materia';
        const detail = target.type === 'group'
          ? scheduleTeacherName_(session)
          : [session.Grupo_Nombre, session.Aula_Nombre, session.Texto_Clase]
            .filter(Boolean).join(' ');
        const key = subject + '\u0000' + detail;
        if (!unique[key]) {
          unique[key] = true;
          table += '<div><span class="subject">' + escapeHtml_(subject) + '</span>' +
            '<span class="' + (target.type === 'group' ? 'teacher' : 'group') + '">' +
            escapeHtml_(detail) + '</span></div>';
        }
      });
      table += '</td>';
    });
    table += '</tr>';
  });
  table += '</tbody></table>';
  const css = fetchText_(HORARIOS_WEB_BASE_URL + '/style.css');
  const generatedAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  return '<!doctype html><html lang="es"><head><meta charset="UTF-8"><style>' + css +
    '</style><style>@page{size:A4 landscape;margin:5mm}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}html,body{width:100%;height:100%;overflow:hidden}body{background:#fff}main{max-width:none;margin:0;padding:0}.tables-container{display:block}.schedule-table{width:100%;font-size:8pt;page-break-inside:avoid;break-inside:avoid}.schedule-table caption{position:static;font-size:12pt;padding:.35rem .5rem}.schedule-table thead th{position:static}.schedule-table th,.schedule-table td{padding:.25rem .35rem;line-height:1.15}.schedule-table tbody th{width:70px}.schedule-table tr{page-break-inside:avoid;break-inside:avoid}.print-generated-at{display:block;position:fixed;top:0;right:0;color:#fff;font-size:8pt}</style></head><body><div class="print-generated-at">Generado: ' + generatedAt + '</div><main><div class="tables-container">' +
    table + '</div></main></body></html>';
}


function findTeacherGuid_(sessions, title, path) {
  const teachers = {};
  sessions.forEach((session) => {
    if (!session.Persona_Guid) return;
    teachers[session.Persona_Guid] = scheduleTeacherName_(session);
  });
  let bestGuid = null;
  let bestScore = 0;
  Object.keys(teachers).forEach((guid) => {
    const wanted = tokens_(title);
    const available = tokens_(teachers[guid]);
    const overlap = wanted.filter((token) => available.some((candidate) => tokenMatches_(token, candidate))).length;
    const score = Math.max(overlap / Math.max(wanted.length, 1), overlap / Math.max(available.length, 1));
    if (score > bestScore) {
      bestScore = score;
      bestGuid = guid;
    }
  });
  if (!bestGuid || bestScore === 0) {
    const fileAlias = normalize_(String(path || '').split('/').pop().replace(/^Profesores_/, '').replace(/\.htm$/i, '').replace(/\d+$/, ''));
    bestGuid = Object.keys(teachers).find((guid) =>
      normalize_(guid) === fileAlias || normalize_(teachers[guid]) === fileAlias ||
      (fileAlias.length >= 3 && (normalize_(guid).indexOf(fileAlias) === 0 || normalize_(teachers[guid]).indexOf(fileAlias) === 0))
    ) || bestGuid;
  }
  return bestGuid;
}


function scheduleTeacherName_(session) {
  return [session.Persona_Nombre, session.Persona_Apellido1, session.Persona_Apellido2]
    .filter(Boolean).join(' ').trim();
}


function sortScheduleSlots_(slots) {
  return [...new Set(slots)].sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}


function scheduleColor_(value) {
  let hash = 0;
  String(value || 'default').split('').forEach((character) => { hash = character.charCodeAt(0) + ((hash << 5) - hash); });
  const saturation = 70 + (Math.abs(hash >> 8) % 21);
  const lightness = 90 + (Math.abs(hash >> 16) % 6);
  return 'hsl(' + (Math.abs(hash) % 360) + ', ' + saturation + '%, ' + lightness + '%)';
}


function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}


function buildLegacyPrintableHtml_(path) {
  const baseUrl = getBaseUrl_();
  const pageUrl = baseUrl + '/' + path;
  const folderPath = path.split('/').slice(0, -1).join('/');
  const cssUrl = baseUrl + '/' + folderPath + '/untis.css';
  let html = fetchText_(pageUrl);
  const css = fetchText_(cssUrl);
  html = html.replace(
    /<meta\s+http-equiv="Content-Type"\s+content="text\/html;\s*charset=[^"]+"\s*>/i,
    '<meta charset="UTF-8">'
  );
  html = html.replace(/<link\s+rel="stylesheet"\s+type="text\/css"\s+href="untis\.css"\s*>/i, '<style>' + css + '</style>');
  html = html.replace('</head>', `<style>
body > center {
  width: 100% !important;
  max-width: none !important;
  box-sizing: border-box !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
body > center[style] {
  display: block !important;
  width: 100vw !important;
  max-width: none !important;
}
body > center > table.generated-timetable {
  width: 100vw !important;
  min-width: 100vw !important;
  max-width: none !important;
}
body > center > table[border="3"][rules="all"] {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  table-layout: fixed !important;
}
body > center > table[border="3"][rules="all"] > tbody > tr > td:first-child,
body > center > table[border="3"][rules="all"] > tr > td:first-child {
  width: 9% !important;
  min-width: 0 !important;
}
body > center > table[border="3"][rules="all"] > tbody > tr > td:not(:first-child),
body > center > table[border="3"][rules="all"] > tr > td:not(:first-child) {
  width: 18.2% !important;
}
@media print {
  @page { size: landscape; margin: 2mm; }
}
</style></head>`);
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
  let baseUrl = String(
    PropertiesService.getScriptProperties().getProperty('SITE_BASE_URL') || DEFAULT_SITE_BASE_URL
  ).trim().replace(/\/+$/, '');
  if (/^https:\/\/gecoas\.github\.io$/i.test(baseUrl)) {
    baseUrl += '/untis';
  }
  return baseUrl;
}


function fetchText_(url) {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('No se pudo cargar ' + url + ' (HTTP ' + code + ')');
  }
  const utf8 = response.getContentText('UTF-8');
  const declaration = utf8.match(/charset\s*=\s*["']?\s*([^\s"';>]+)/i);
  const declared = declaration ? declaration[1].toLowerCase() : '';
  const encoding = /(?:iso-8859-1|latin1|windows-1252)/.test(declared)
    ? 'ISO-8859-1'
    : 'UTF-8';
  return response.getContentText(encoding);
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
