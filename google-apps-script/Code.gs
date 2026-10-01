const SHEET_NAME = 'Guest Messages';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const parameters = e && e.parameter ? e.parameter : {};
    const name = cleanCell(parameters.name, 120);
    const message = cleanCell(parameters.message, 2000);

    if (!name || !message) {
      return ContentService.createTextOutput('Name and message are required.');
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('Bind this script to the guest messages spreadsheet.');
    }

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received At', 'Guest Name', 'Message']);
    }

    sheet.appendRow([new Date(), name, message]);
    return ContentService.createTextOutput('OK');
  } finally {
    lock.releaseLock();
  }
}

function cleanCell(value, maxLength) {
  let text = String(value || '').trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}
