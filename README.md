## Node Version
```bash
$ Node version : 18.16.01
$ NPM version : 9.5.1
```
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Step by step


Integrate Google Drive, SharePoint, and Dropbox with NestJS

Prerequisites
    1. Cloud Platform Accounts: Ensure you have active accounts for Google Cloud Platform, Microsoft Azure (for SharePoint), and Dropbox.
    2. NestJS Application: You should have a basic NestJS application set up.
   
1. Setting Up Google Drive Integration
Google Cloud Project Configuration:
    1. Create a Google Cloud Project:
        ◦ Go to the Google Cloud Console.
        ◦ Create a new project.
    2. Enable Google Drive API:
        ◦ Navigate to APIs & Services > Library.
        ◦ Search for "Google Drive API" and enable it for your project.
    3. Create OAuth 2.0 Credentials:
        ◦ Go to APIs & Services > Credentials.
        ◦ Click on Create Credentials and select OAuth 2.0 Client ID.
        ◦ Configure the consent screen if you haven't already.
        ◦ Set the application type to Web application.
        ◦ Add the necessary Authorized redirect URIs (e.g., http://localhost:3000/google/auth/callback).
        ◦ Save your credentials and note the Client ID and Client Secret.
Install Command:
npm install googleapis 
Environment Variables
    • Create a .env file in the root of your NestJS project.
    • Add the following variables:
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/google/auth/callback

2. Setting Up SharePoint Integration
Microsoft Azure AD Application Configuration
    1. Register an Application in Azure AD:
        ◦ Go to the Azure Portal.
        ◦ Navigate to Azure Active Directory > App registrations.
        ◦ Click on New registration and fill in the application details.
        ◦ Set the redirect URI (e.g., http://localhost:3000/sharepoint/auth/callback).
        ◦ Register the application.
    2. Configure API Permissions:
        ◦ Navigate to API permissions.
        ◦ Add permissions for Microsoft Graph and SharePoint.
        ◦ Grant admin consent for the permissions.
    3. Generate Client Secret:
        ◦ Navigate to Certificates & secrets.
        ◦ Create a new client secret and note the value.
Install Command:
npm install @azure/msal-node @microsoft/microsoft-graph-client 

Environment Variables
    • Add the following variables to your .env file:
SHAREPOINT_CLIENT_ID=YOUR_CLIENT_ID
SHAREPOINT_CLIENT_SECRET=YOUR_CLIENT_SECRET
SHAREPOINT_REDIRECT_URI=http://localhost:3000/sharepoint/auth/callback
TENANT_ID=YOUR_TENANT_ID

3. Setting Up Dropbox Integration
Dropbox App Configuration
    1. Create a Dropbox App:
        ◦ Go to the Dropbox App Console.
        ◦ Click on Create App.
        ◦ Choose the appropriate API and permissions for your app.
        ◦ Set the redirect URI (e.g., http://localhost:3000/dropbox/auth/callback).
    2. Generate App Key and Secret:
        ◦ Note the App Key and App Secret.
Environment Variables
    • Add the following variables to your .env file:
DROPBOX_APP_KEY=YOUR_APP_KEY
DROPBOX_APP_SECRET=YOUR_APP_SECRET
DROPBOX_REDIRECT_URI=http://localhost:3000/dropbox/auth/callback
Install Command:
npm install dropbox 

General Steps for Integration
1. Install Necessary Packages
    • Install the required npm packages for handling OAuth2 and making API requests.
2. Implement OAuth2 Flow
    1. Authorization URL:
        ◦ Generate the authorization URL for each service.
        ◦ Redirect the user to the authorization URL.
    2. Callback Handling:
        ◦ Handle the callback from each service.
        ◦ Extract the authorization code from the query parameters.
    3. Exchange Authorization Code for Tokens:
        ◦ Exchange the authorization code for access and refresh tokens.
    4. Store Tokens:
        ◦ Store the tokens securely for subsequent API requests.
3. Implement API Integration and Download Files
    1. Google Drive:
        ◦ Use the Google Drive API to interact with the user's files.
        ◦ Authenticate using the googleapis library.
        ◦ List files and download them using the Google Drive API.

    2. SharePoint:
        ◦ Use the Microsoft Graph API to interact with SharePoint files.
        ◦ Authenticate using the @azure/msal-node library.
        ◦ List files and download them using the Microsoft Graph API.
    3. Dropbox:
        ◦ Use the Dropbox API to interact with the user's files.
        ◦ Authenticate using the dropbox library
        ◦ List files and download them using the Dropbox API.
4.Zip the Downloaded Files
Use a library like archiver to zip the downloaded files.
5.Provide an Endpoint to Download the Zip File
Create a NestJS endpoint that serves the zip file for download.

Summary
    1. Setup Cloud Projects:
        ◦ Google Drive: Create project, enable API, and configure OAuth2 credentials.
        ◦ SharePoint: Register Azure AD app, configure permissions, and generate client secret.
        ◦ Dropbox: Create app and configure OAuth2 credentials.
    2. Configure Environment Variables:
        ◦ Add necessary credentials to the .env file.
    3. Install Dependencies:
        ◦ Install necessary npm packages for OAuth2 and API interactions.
    4. Implement OAuth2 Flow:
        ◦ Implement endpoints for OAuth2 authorization, callback handling, and token exchange.
    5. API Integration:
        ◦ Implement API calls to Google Drive, SharePoint, and Dropbox to perform desired operations.
      6. Zip Files and Provide Download:
    • Zip downloaded files and create an endpoint for downloading the zip file.





