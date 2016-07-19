/*
The MIT License (MIT)

Copyright (c) 2016 Adrian Bota

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function (global) {
  /**
   * Google API authorize
   * @param {Boolean} [noImmediateAuth]
   * @return {Object} Promise
   */
  var authorize = function (noImmediateAuth) {
    return gapi.auth.authorize({
      client_id: GDriveAppData.config.clientId,
      scope: GDriveAppData.config.scope,
      immediate: !noImmediateAuth
    }).then(function () {
      if (!gapi.auth.getToken()) {
        throw 'authFailed';
      }
    }, function (reason) {
      return reason;
    });
  };

  /**
   * Load Google Drive API
   * @param {Boolean} [noImmediateAuth]
   * @return {Object} Promise
   */
  var loadDriveAPI = function (noImmediateAuth) {
    return authorize(noImmediateAuth).then(function () {
      return gapi.client.load('drive', 'v3');
    }).then(function () {
      if (!gapi.client.drive) {
        throw 'driveAPILoadFailed';
      }
    }, function (reason) {
      return reason;
    });
  };

  /**
   * Get the id of the app data file, if it exists
   * or create it, if it doesn't exist
   * @param {Boolean} [noImmediateAuth]
   * @return {Object} Promise
   */
  var getAppDataFileId = function (noImmediateAuth) {
    return loadDriveAPI(noImmediateAuth).then(function () {
      return gapi.client.drive.files.list({
        q: 'name="' + GDriveAppData.config.appDataFileName + '"',
        spaces: 'appDataFolder',
        fields: 'files(id)'
      }).then(function (response) {
        if (response && response.result && response.result.files && response.result.files.length > 0 && response.result.files[0].id) {
            return response.result.files[0].id;
        }

        return gapi.client.drive.files.create({
          fields: 'id',
          resource: {
            name: GDriveAppData.config.appDataFileName,
            parents: [
              'appDataFolder'
            ]
          }
        }).then(function (response) {
          if (response && response.result && response.result.id) {
            return response.result.id;
          }
          throw 'appDataCreateFailed';
        });
      });
    });
  };

  var GDriveAppData = {
    /**
     * Configuration
     * @type {Object}
     */
    config: {
      appDataFileName: 'my-app-data.json',
      clientId: null,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata'
    },

    /**
     * Load app data
     * @param {Boolean} [noImmediateAuth]
     * @return {Object} Promise
     */
    loadAppData: function (noImmediateAuth) {
      return getAppDataFileId(noImmediateAuth).then(function (fileId) {
        return gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        }).then(function (response) {
          return response.result;
        }, function () {
          if (!noImmediateAuth) {
            return GDriveAppData.loadAppData(true);
          }
        });
      });
    },

    /**
     * Get the id of the app data file, if it exists
     * or create it, if it doesn't exist
     * @param {Object} appData Application data
     * @param {Boolean} [noImmediateAuth]
     * @return {Object} Promise
     */
    saveAppData: function (appData, noImmediateAuth) {
      return getAppDataFileId(noImmediateAuth).then(function (fileId) {
        return gapi.client.request({
          path: '/upload/drive/v3/files/' + fileId,
          method: 'PATCH',
          params: {
            uploadType: 'media'
          },
          body: JSON.stringify(appData)
        }, function () {
          if (!noImmediateAuth) {
            return GDriveAppData.saveAppData(appData, true);
          }
        });
      });
    }
  };

  // Make it availale globally
  global.GDriveAppData = GDriveAppData;
})(this);
