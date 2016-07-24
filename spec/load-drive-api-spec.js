describe('Load Google Drive API', function () {
  var loadDriveAPI = require('../src/load-drive-api');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.deferreds = gapiMock();
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
