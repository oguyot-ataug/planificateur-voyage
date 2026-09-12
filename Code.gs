/**
 * Planificateur de voyage — backend Apps Script
 * Les données sont stockées dans deux feuilles de ce classeur Google Sheet :
 * "Etapes" et "Voyageurs".
 */

const SHEET_NAME = 'Etapes';
const SHEET_VOYAGEURS = 'Voyageurs';
const SPREADSHEET_ID = '1Q0FPonsFtDEm-TWZ8ZhjqgH1x5sjlC-hzB0NQQm_W8w';
const HEADERS = ['id', 'type', 'titre', 'lieu', 'dateDebut', 'heureDebut', 'dateFin', 'heureFin', 'details', 'sousType', 'lieuArrivee', 'lien', 'prix', 'voyageurs', 'chambres'];
const HEADERS_VOYAGEURS = ['id', 'nom'];

// Clé API "Maps Embed API" — voir instructions fournies pour la générer.
const MAPS_API_KEY = 'REMPLACE_PAR_TA_CLE_API';

function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  template.mapsApiKey = MAPS_API_KEY;
  return template.evaluate()
    .setTitle('Planificateur de voyage')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSheetVoyageurs_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_VOYAGEURS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_VOYAGEURS);
    sheet.appendRow(HEADERS_VOYAGEURS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function formatValue_(header, v) {
  if (v instanceof Date) {
    if (header === 'heureDebut' || header === 'heureFin') {
      return Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm');
    }
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return v;
}

/** Renvoie toutes les étapes, triées par date/heure de début */
function getEtapes() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const etapes = values.slice(1)
    .map(function (row) {
      const obj = {};
      HEADERS.forEach(function (h, i) {
        obj[h] = formatValue_(h, row[i]);
      });
      return obj;
    })
    .filter(function (e) { return e.id; });

  etapes.sort(function (a, b) {
    const da = (a.dateDebut || '') + ' ' + (a.heureDebut || '00:00');
    const db = (b.dateDebut || '') + ' ' + (b.heureDebut || '00:00');
    return da.localeCompare(db);
  });

  return etapes;
}

/** Crée ou met à jour une étape (si etape.id existe déjà, on met à jour la ligne) */
function saveEtape(etape) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  let rowIndex = -1;

  if (etape.id) {
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === etape.id) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  if (!etape.id) {
    etape.id = Utilities.getUuid();
  }

  const row = HEADERS.map(function (h) { return etape[h] || ''; });

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return etape;
}

/** Supprime une étape par id */
function deleteEtape(id) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

/** Renvoie tous les voyageurs */
function getVoyageurs() {
  const sheet = getSheetVoyageurs_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1)
    .map(function (row) { return { id: row[0], nom: row[1] }; })
    .filter(function (v) { return v.id; });
}

/** Crée ou met à jour un voyageur */
function saveVoyageur(voyageur) {
  const sheet = getSheetVoyageurs_();
  const values = sheet.getDataRange().getValues();
  let rowIndex = -1;

  if (voyageur.id) {
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === voyageur.id) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  if (!voyageur.id) {
    voyageur.id = Utilities.getUuid();
  }

  const row = [voyageur.id, voyageur.nom || ''];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, HEADERS_VOYAGEURS.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return voyageur;
}

/** Supprime un voyageur par id */
function deleteVoyageur(id) {
  const sheet = getSheetVoyageurs_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}
