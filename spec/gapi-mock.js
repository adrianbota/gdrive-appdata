var lodashSet = require('lodash/set');
var lodashZipWith = require('lodash/zipWith');
var lodashZipObject = require('lodash/zipObject');
var defer = require('deferred');

var requests = [
  'gapi.auth.authorize',
  'gapi.client.load',
  'gapi.client.drive.files.list',
  'gapi.client.drive.files.create',
  'gapi.client.drive.files.get',
  'gapi.client.request'
];

var gapiRequestMock = function (request) {
  var deferred = defer();
  lodashSet(window, request, jasmine.createSpy(request).and.returnValue(deferred.promise));
  return deferred;
};

module.exports = function () {
  return lodashZipObject(requests, lodashZipWith(requests, gapiRequestMock));
};
