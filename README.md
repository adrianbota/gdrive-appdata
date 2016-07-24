# gdrive-appdata
Javascript utility to store application data to Google Drive app data folder.

## Including it in your app
The distribution file is inside the `dist` folder.
Including that file in your html file, will reveal a global variable named `GDriveAppData` which makes the config and API available.

## Configuration
The default configuration looks like:
```javascript
{
  // check Google documentaion for scope
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata'
  ],
  // check Google documentaion for client id
  clientId: null,
  // google drive API version
  driveVersion: 'v3',
  // name of the app data file
  appDataFileName: 'my-app-data.json',
  // check Google documentaion for immediate autorization
  immediateAuth: true
};
```

It is **mandatory** that you extend this configuration and provide your application `clientId`:
```javascript
GDriveAppData.config.clientId = 'YOUR_APP_CLIENT_ID';
```

It is recommended that you also provide a file name other than the default `my-app-data.json`:
```javascript
GDriveAppData.config.appDataFileName = 'foo-bar.json';
```

The other configuration parameters can be left as they are.

## API
The API consists of 2 straight forward methods: `loadAppData` and `saveAppData`.
You can call these methods only after you have configured your `clientId` and, optionally, your `appDataFileName`.
Usually, the flow is: load app data at the start of your app, and then save the data at some point in your app life cycle.

### Loading app data
```javascript
GDriveAppData.loadAppData().then(function (appData) {
  // do something with appData here
}, function () {
  // handle error (show UI button and try to load again without immediate authorization)
});
```

When the user has not authorized your app to save data in the google drive, `loadAppData` will fail on first call. 
When this happens, you must show an UI element (usually a button), and on click of this element you should make the following call:
```javascript
// ensure an authorization popup is shown where user can login and authorize your app
GDriveAppData.config.immediateAuth = false;
// load the app data again
GDriveAppData.loadAppData().then(function (appData) {
  // do something with appData here
});
```

**NOTE:** You don't need to reset `immediateAuth` to `true` as it will be automatically reset for future calls of `loadAppData` or `saveAppData`.

### Saving app data
```
GDriveAppData.loadAppData(appData);
```

`appData` must be a serializable object (`JSON.stringify` must not fail on it)

### What happens under the hood
Load app data has the following flow: authorize, load drive api, get app data file id or create app data file and get its id, and, finally, load app data.

Save app data has the same flow, except it saves the app data at the end.

[![Build Status](https://travis-ci.org/adrianbota/gdrive-appdata.svg?branch=master)](https://travis-ci.org/adrianbota/gdrive-appdata)
