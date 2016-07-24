var lodashAssign = require('lodash/assign');
var defaultConfig = require('./default-config');
var appDataInitRequests = require('./app-data-init-requests');
var loadAppData = require('./load-app-data');
var saveAppData = require('./save-app-data');

var resetImmediateAuth = function () {
  // always reset immediate authorization so next requests are done silently
  return api.config = lodashAssign({}, api.config, {
    immediateAuth: true
  });
};

var api = {
  config: lodashAssign({}, defaultConfig),

  loadAppData: function () {
    return appDataInitRequests(api.config).then(function (fileId) {
      resetImmediateAuth();
      return loadAppData(fileId);
    });
  },

  saveAppData: function (appData) {
    return appDataInitRequests(api.config).then(function (fileId) {
      resetImmediateAuth();
      return saveAppData(api.config.driveVersion, fileId, appData);
    });
  }
};

module.exports = api;
