var _get = require('lodash/get');
var idxTpl = require('index-template');

module.exports = function (file, clientId) {
  var immediate = true;

  var authorize = function () {
    return gapi.auth
      .authorize({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
        immediate: immediate
      })
      .then(
        function (response) { immediate = true; return response; },
        function (error) { immediate = false; throw error; }
      );
  };

  var loadDriveAPI = function () {
    return gapi.client.load('drive', 'v3');
  };

  var create = function () {
    return gapi.client.drive.files
      .create({
        fields: 'id',
        resource: { name: file, parents: ['appDataFolder'] }
      })
      .then(function (response) {
        return _get(response, 'result.id', null);
      });
  };

  var getFileId = function () {
    return gapi.client.drive.files
      .list({
        q: idxTpl('name="{0}"', file),
        spaces: 'appDataFolder',
        fields: 'files(id)'
      })
      .then(function (response) {
        return _get(response, 'result.files[0].id', null) || create();
      });
  };

  var prepare = function () {
    return authorize().then(function () {
      return loadDriveAPI().then(getFileId);
    });
  };

  return {
    read: function () {
      return prepare().then(function (id) {
        return gapi.client.drive.files
          .get({ fileId: id, alt: 'media' })
          .then(function (response) {
            return _get(response, 'result', null);
          });
      });
    },

    save: function (data) {
      return prepare().then(function (id) {
        return gapi.client
          .request({
            path: idxTpl('/upload/drive/v3/files/{0}', id),
            method: 'PATCH',
            params: { uploadType: 'media' },
            body: JSON.stringify(data)
          });
      });
    }
  };
};
