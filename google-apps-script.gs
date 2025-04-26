// This code should be deployed as a Google Apps Script Web App
// Follow these steps:
// 1. Go to https://script.google.com/ and create a new project
// 2. Copy-paste this code
// 3. Create a Google Sheet and copy its ID from the URL (the long string between /d/ and /edit in the URL)
// 4. Replace SHEET_ID with your Google Sheet ID
// 5. Deploy as a web app (accessible to anyone, even anonymous)
// 6. Copy the deployment URL and use it in your React app

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const SHEET_NAME = 'Contacts';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // CORS headers
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Return early for preflight requests
  if (e.method === 'OPTIONS') {
    return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }
  
  try {
    // Get parameters
    const name = e.parameter.name || '';
    const phone = e.parameter.phone || '';
    const telegram = e.parameter.telegram || '';
    const message = e.parameter.message || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Open the spreadsheet and get the sheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Telegram', 'Message']);
    }
    
    // Append the data
    sheet.appendRow([timestamp, name, phone, telegram, message]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      data: { name, phone, telegram }
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
} 