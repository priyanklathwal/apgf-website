# APGF Website - ASEAN Power Grid Financing Initiative

This is the website for the ASEAN Power Grid Financing Initiative (APGF), a joint initiative of ASEAN, the Asian Development Bank, and the World Bank.

## Directory Structure

```
apgf-website/
├── index.html          # Home page
├── about.html          # About APGF page
├── pace.html           # PACE (Partnership for ASEAN Connectivity on Energy) page
├── portal.html         # Partner submission portal
├── css/
│   └── styles.css      # Main stylesheet (ASEAN color scheme)
├── js/
│   ├── main.js         # General JavaScript functionality
│   └── portal.js       # Partner portal form handling
├── images/             # Images directory (add logos here)
└── README.md           # This file
```

## Viewing the Website Locally

Simply open `index.html` in a web browser, or start a local server:

```bash
# Using Python 3
cd apgf-website
python3 -m http.server 8000

# Then visit http://localhost:8000
```

## Google Sheets Integration Setup

The Partner Portal submits data to Google Sheets. Follow these steps to set it up:

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "APGF Partner Applications" or similar
3. Add the following headers in Row 1:
   - A1: `timestamp`
   - B1: `partnerType`
   - C1: `partnerTypeLabel`
   - D1: `orgName`
   - E1: `country`
   - F1: `website`
   - G1: `orgDescription`
   - H1: `contactName`
   - I1: `contactTitle`
   - J1: `contactEmail`
   - K1: `contactPhone`
   - L1: `projectStages`
   - M1: `countries`
   - N1: `interestDescription`
   - O1: `additionalInfo`
   - (Add more columns for partner-type-specific fields as needed)

### Step 2: Create a Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Get headers from first row
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Create row data based on headers
    var rowData = headers.map(function(header) {
      return data[header] || '';
    });

    // Append the row
    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("APGF Partner Portal API is running")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Save the script (Ctrl/Cmd + S)
4. Click **Deploy > New deployment**
5. Click the gear icon next to "Select type" and choose **Web app**
6. Set the following:
   - Description: "APGF Partner Portal"
   - Execute as: "Me"
   - Who has access: "Anyone"
7. Click **Deploy**
8. Click **Authorize access** and follow the prompts
9. Copy the **Web app URL** provided

### Step 3: Update the Website

1. Open `js/portal.js`
2. Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web app URL

## Hosting Options

### Static Hosting (Recommended for initial deployment)

The website can be hosted on any static hosting service:

- **GitHub Pages** - Free, easy to set up
- **Netlify** - Free tier available, great for static sites
- **Vercel** - Free tier available
- **AWS S3 + CloudFront** - Scalable, enterprise-ready
- **Azure Static Web Apps** - Microsoft cloud option

### Migration to ASEAN/World Bank Infrastructure

The website is designed as pure HTML/CSS/JS with no server-side dependencies, making it easy to migrate:

1. All files can be transferred directly to any web server
2. The Google Sheets integration can be replaced with any backend API
3. Forms can be adapted to use organizational CRM/database systems
4. Styling uses CSS variables, making theme adjustments straightforward

## ASEAN Branding

The website uses official ASEAN colors:

- **Blue** (#22559E) - Peace and stability
- **Red** (#E33131) - Courage and dynamism
- **Yellow** (#F8F400) - Prosperity
- **White** (#FFFFFF) - Purity

To add official logos:
1. Place logo files in the `images/` directory
2. Update the HTML to reference the logo images
3. Suggested filenames:
   - `asean-logo.png`
   - `adb-logo.png`
   - `worldbank-logo.png`

## Customization

### Adding New Partner Type Questions

Edit `js/portal.js` and modify the `partnerTypeConfig` object to add or modify questions for each partner type.

### Styling Changes

Edit `css/styles.css`. Key CSS variables are at the top of the file for easy color and spacing adjustments.

### Content Updates

Edit the HTML files directly. Content is based on publicly available information from the APGF concept note presented at the 42nd AMEM.

## Security Considerations

- The Google Apps Script URL should be kept confidential
- Consider adding CAPTCHA for production deployment
- For sensitive data, consider implementing proper authentication
- Review CORS settings if integrating with organizational backends

## Support

For technical questions about this website, please contact the development team.

For questions about the APGF initiative, please contact the ASEAN Secretariat.
