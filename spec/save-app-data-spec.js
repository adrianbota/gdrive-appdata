describe('Save app data', function () {
  var saveAppData = require('../src/save-app-data');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.handler = jasmine.createSpy('handler');
    this.deferreds = gapiMock();
  });

  describe('Calling saveAppData with drive version, file id and file contents args', function () {
    beforeEach(function () {
      saveAppData('v3', 'foo', { test: 'fooBar' });
    });

    it('should call gapi.client.request with the correct input', function () {
      expect(window.gapi.client.request).toHaveBeenCalledWith({
        path: '/upload/drive/v3/files/foo',
        method: 'PATCH',
        params: {
          uploadType: 'media'
        },
        body: '{"test":"fooBar"}'
      });
    });
  });
});
