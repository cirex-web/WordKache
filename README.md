# WordKache - Save Your Translations
## Available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/wordkache-save-your-trans/iggnlghjaffpnnngboejpclkpioimbog)
[![CodeFactor](https://www.codefactor.io/repository/github/cirex-web/wordkache/badge)](https://www.codefactor.io/repository/github/cirex-web/wordkache)
## Running it
`build.zip` should have the most recent stable build. Simply unzip it and drag it into chrome://extensions (turn on Developer Mode first) to run.

## Getting started/If the code doesn't work
Run ```npm i``` to update/install all dependencies. Note that you need nodeJS installed.

To host just the popup part of the Chrome Extension, run `npm start`

To get the full production build, run `npm run build` and load the folder into chrome://extensions as an Unpacked Extension (make sure Developer Mode is on)

### Things to do when doing translation site config
- make sure it works on all screen sizes (it might use different elements)
- multiple output translations?
- Make sure weird input (like new lines and blank trailing/leading spaces) behave correctly in request (and sanitize it if it doesn’t)
- Add host permission to manifest.json (for capturing network requests) (if relevant)

### Other notes
Use the `classnames` package when you have multiple/conditional class names.
Use logger.ts rather than console.log for debugging (So it doesn't appear in prod.)
