## localify
Localify json generation application for different locales, including extracting text for translation into different languages, and formatting data for particular locales. Generate json file automatically based on soruce language to many languages

##  Quickstart
# First, install the library:
> npm install --localify-json-language-generation

or

> yarn add localify-json-language-generation

## Second, Turn on the Google Sheets API:
- Use this https://console.cloud.google.com/flows/enableapi?apiid=sheets.googleapis.com to create or select a project in the Google Developers Console and automatically turn on the API. Click Continue,  then Go to credentials.

- On the Add credentials to your project page, click the Cancel button.

- At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.

- Select the Credentials tab, click the Create credentials button and select OAuth client ID.

- Select the application type Other, enter the name "React Google Sheets Quickstart", and click the Create button.

## Finally, Use the library:
``` 
const localify = require('localify-json-language-generation');

const data= {
    "header": {
      "title": "Login",
      "message": " Please login to your account"
    },
    "form": {
      "input": {
        "username": {
          "placeholderName": "Username",
          "onInvalid": {
            "message": "Username is required"
          }
        },
        "password": {
          "placeholderName": "Password",
          "onInvalid": {
            "message": "Password is required"
          }
        }
      }
     
    }
  }
  
const spreadSheetId = "<spreadsheet-Id>";
const client_email = "<client_email>";
const private_key = "<private_key>"
const lan = ["ja", "de", "zh"] // or const lan = "en";
localify(client_email, private_key, spreadSheetId, lan, data);
```
