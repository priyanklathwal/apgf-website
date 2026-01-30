/**
 * Google Apps Script for APGF Partner Portal
 *
 * Instructions:
 * 1. Create a new Google Sheet for storing submissions
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire script and paste it
 * 4. Save and Deploy as Web App
 * 5. Copy the Web App URL to js/portal.js
 */

/**
 * Handle POST requests from the Partner Portal form
 */
function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);

    // Log the submission (helpful for debugging)
    console.log('Received submission:', JSON.stringify(data));

    // Get headers from first row
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // If no headers exist, create them from the data keys
    if (headers[0] === '' || headers.length === 0) {
      headers = Object.keys(data);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Create row data based on headers
    var rowData = headers.map(function(header) {
      var value = data[header];
      // Handle arrays (convert to comma-separated string)
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value || '';
    });

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Send email notification (optional - uncomment to enable)
    // sendNotificationEmail(data);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Application submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error
    console.error('Error processing submission:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput("APGF Partner Portal API is running. Use POST to submit applications.")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Optional: Send email notification when new application is received
 * Uncomment the call in doPost() to enable
 */
function sendNotificationEmail(data) {
  var recipients = 'your-email@example.com'; // Change this
  var subject = 'New PACE Partner Application: ' + data.orgName;

  var body = 'A new partner application has been submitted:\n\n';
  body += 'Organization: ' + data.orgName + '\n';
  body += 'Type: ' + data.partnerTypeLabel + '\n';
  body += 'Country: ' + data.country + '\n';
  body += 'Contact: ' + data.contactName + ' (' + data.contactEmail + ')\n';
  body += '\nPlease review the full submission in the Google Sheet.';

  MailApp.sendEmail(recipients, subject, body);
}

/**
 * Initialize the spreadsheet with headers
 * Run this function once to set up the sheet
 */
function initializeSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var headers = [
    'timestamp',
    'partnerType',
    'partnerTypeLabel',
    'orgName',
    'country',
    'website',
    'orgDescription',
    'contactName',
    'contactTitle',
    'contactEmail',
    'contactPhone',
    'projectStages',
    'countries',
    'interestDescription',
    'additionalInfo',
    'consent',
    // MDB/DFI specific
    'institutionType',
    'financingTypes',
    'indicativeAmount',
    'existingEngagement',
    // Private Sector specific
    'businessType',
    'investmentFocus',
    'investmentSize',
    'aseanExperience',
    // Public Sector specific
    'entityType',
    'mandate',
    'interconnectionInterest',
    'supportNeeds',
    // Knowledge Partner specific
    'orgType',
    'supportAreas',
    'thematicFocus',
    'existingPrograms'
  ];

  // Set headers in first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#22559E')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  console.log('Sheet initialized with ' + headers.length + ' columns');
}
