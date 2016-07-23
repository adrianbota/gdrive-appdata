var lodashGet = require('lodash/get');

var getFileId = function (response) {
  return lodashGet(response, 'result.id', null);
};

module.exports = function createAppDataFile(appDataFileName) {
  return gapi.client.drive.files.create({
    fields: 'id',
    resource: {
      name: appDataFileName,
      parents: ['appDataFolder']
    }
  }).then(getFileId);
};
