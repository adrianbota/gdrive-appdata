# gdrive-appdata
Javascript utility to store application data to Google Drive app data folder.

## Including it in your app
The distribution file is inside the `dist` folder (`gdad.js`).
Including that file in your html file will expose a global variable named `gdad` which is a factory.

## Creating app data API
```javascript
var appData = gdad('your_file_name.json', 'YOUR_APP_CLIENT_ID')
```
## API
The API consists of 2 straight forward methods: `read` and `save`.
Usually, the flow is: reading app data at the start of your app, and then save the data at some point in your app life cycle.

### Reading app data
```javascript
appData.read().then(function (data) {
  // do something with data here
}, function () {
  // handle error (show UI button and try to read again; this time it will show the authorize popup)
});
```

When the user has not authorized your app to save data in the google drive, `read` will fail on first call. 
When this happens, you must show an UI element (usually a button), on click of this element you should  call `appData.read()` again, and this time it will show the authorize popup.

### Saving app data
```
appData.save(data);
```

`data` must be a serializable object (`JSON.stringify` must not fail on it)

### What happens under the hood
`read` has the following flow: authorize, load drive api, get app data file id or create app data file and get its id, and, finally, read app data.

`save` has the same flow, except it saves the app data at the end.

[![Build Status](https://travis-ci.org/adrianbota/gdrive-appdata.svg?branch=master)](https://travis-ci.org/adrianbota/gdrive-appdata)
