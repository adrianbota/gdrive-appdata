var indexTemplate = require('index-template');
var lodashGet = require('lodash/get');

var getFileId = function (response) {
  return lodashGet(response, 'result.files[0].id', null);
};

module.exports = function retrieveAppDataFileId(appDataFileName) {
  return gapi.client.drive.files.list({
    q: indexTemplate('name="{0}"', appDataFileName),
    spaces: 'appDataFolder',
    fields: 'files(id)'
  }).then(getFileId);
};
