# Contact Form Google Sheets Integration Setup Guide

This guide will walk you through setting up the Contact form to submit data to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the spreadsheet to something like "ZamonAI Contact Form Submissions"
3. Copy the Sheet ID from the URL. It's the long string between `/d/` and `/edit` in your browser's address bar
   - Example: In `https://docs.google.com/spreadsheets/d/1ABC123_EXAMPLE_ID_456XYZ/edit#gid=0`, the Sheet ID is `1ABC123_EXAMPLE_ID_456XYZ`

## Step 2: Create and Deploy the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/) and create a new project
2. Delete any code in the editor and paste the code from the `google-apps-script.gs` file provided
3. Replace `YOUR_GOOGLE_SHEET_ID` with the Sheet ID you copied in Step 1
4. Save the project (File > Save) and give it a name like "ZamonAI Contact Form Handler"
5. Deploy the script as a web app:
   - Click on "Deploy" > "New deployment"
   - Select "Web app" as the deployment type
   - Description: "ZamonAI Contact Form Handler"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (This allows the form to submit data without authentication)
   - Click "Deploy"
6. You'll be prompted to authorize the app. Review the permissions and click "Allow"
7. Copy the Web App URL that's generated after deployment

## Step 3: Update the React Application

1. Open the file `src/components/Contact/index.jsx`
2. Find the line with `const scriptURL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec';`
3. Replace `YOUR_DEPLOYMENT_ID_HERE` with the Web App URL you copied in Step 2
4. Save the file

## Testing the Integration

1. Run your React application
2. Fill out the contact form and submit it
3. Check your Google Sheet to confirm the data was received
4. You should see a new row with the form submission data

## Troubleshooting

If the form submissions aren't appearing in your Google Sheet:

1. Check the browser console for any errors
2. Verify that the Google Apps Script deployment is set to "Anyone" for access
3. Ensure the Sheet ID in the Apps Script code matches your actual Google Sheet
4. Try redeploying the Apps Script with a new version

## Maintenance

- The script will automatically create a sheet named "Contacts" in your spreadsheet if it doesn't exist
- To view submissions, simply open your Google Sheet
- You can add formulas or additional sheets to process the data as needed 