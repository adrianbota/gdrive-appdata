var lodashAssign = require('lodash/assign');
var config = require('./config');
var authorize = require('./authorize');
var loadDriveAPI = require('./load-drive-api');
var retrieveAppDataFileId = require('./retrieve-app-data-file-id');
var createAppDataFile = require('./create-app-data-file');
var loadAppData = require('./load-app-data');
var saveAppData = require('./save-app-data');

var getFileId = function () {
  var clientId = api.config.clientId;
  var scopes = api.config.scopes;
  var immediateAuth = api.config.immediateAuth;

  api.config.immediateAuth = true;

  return authorize(clientId, scopes, immediateAuth).then(function () {
    return loadDriveAPI(api.config.driveVersion).then(function () {
      return retrieveAppDataFileId(api.config.appDataFileName).then(function (fileId) {
        return (fileId || createAppDataFile(api.config.appDataFileName));
      })
    })
  });
};

var api = {
  config: lodashAssign({}, config),

  loadAppData: function () {
    return getFileId().then(function (fileId) {
      return loadAppData(fileId);
    });
  },

  saveAppData: function (appData) {
    return getFileId().then(function (fileId) {
      return saveAppData(api.config.driveVersion, fileId, appData);
    });
  }
};

module.exports = api;
