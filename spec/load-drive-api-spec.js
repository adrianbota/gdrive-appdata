describe('loadDriveAPI', function () {
  var loadDriveAPI = require('../src/load-drive-api');
  var lodashSet = require('lodash/set');

  beforeEach(function () {
    lodashSet(window, 'gapi.client.load', jasmine.createSpy('load'));
  });

  describe('Calling loadDriveAPI with `version` arg', function () {
    beforeEach(function () {
      loadDriveAPI('v3');
    });

    it('should call gapi.auth.authorize with the correct version', function () {
      expect(window.gapi.client.load).toHaveBeenCalledWith('drive', 'v3');
    });
  });
});
