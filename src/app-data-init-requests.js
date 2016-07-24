var authorize = require('./authorize');
var loadDriveAPI = require('./load-drive-api');
var retrieveAppDataFileId = require('./retrieve-app-data-file-id');
var createAppDataFile = require('./create-app-data-file');

module.exports = function appDataInitRequests(config) {
  return authorize(config).then(function () {
    return loadDriveAPI(config.driveVersion).then(function () {
      return retrieveAppDataFileId(config.appDataFileName).then(function (fileId) {
        // if file exists, return its id, otherwise create the file
        return (fileId || createAppDataFile(config.appDataFileName));
      });
    });
  });
};
