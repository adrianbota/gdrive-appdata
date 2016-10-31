var _set = require('lodash/set');
var _each = require('lodash/each');
var defer = require('deferred');

module.exports = function () {
  var deferreds = {};

  _each([
    'gapi.auth.authorize',
    'gapi.client.load',
    'gapi.client.drive.files.list',
    'gapi.client.drive.files.create',
    'gapi.client.drive.files.get',
    'gapi.client.request'
  ], function (request) {
    deferreds[request] = defer();
    _set(global, request, jasmine.createSpy(request).and.returnValue(deferreds[request].promise));
  });

  return {
    resolve: function (request, response) {
      deferreds[request].resolve(response);
    },

    reject: function (request, reason) {
      deferreds[request].reject(reason);
    }
  };
};
