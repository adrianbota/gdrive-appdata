var lodashGet = require('lodash/get');

var getData = function () {
  return lodashGet(response, 'result', null);
};

module.exports = function loadAppData(fileId) {
  return gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media'
  }).then(getData);
};
