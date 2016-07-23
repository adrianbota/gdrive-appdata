var indexTemplate = require('index-template');

module.exports = function saveAppData(driveVersion, fileId, appData) {
  return gapi.client.request({
    path: indexTemplate('/upload/drive/{0}/files/{1}', driveVersion, fileId),
    method: 'PATCH',
    params: {
      uploadType: 'media'
    },
    body: JSON.stringify(appData)
  });
};
