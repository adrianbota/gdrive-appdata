describe('Retrieve app data file id', function () {
  var retrieveAppDataFileId = require('../src/retrieve-app-data-file-id');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.handler = jasmine.createSpy('handler');
    this.deferreds = gapiMock();
  });

  describe('Calling retrieveAppDataFileId with a file name arg', function () {
    beforeEach(function () {
      retrieveAppDataFileId('foo.json').then(this.handler);
    });

    it('should call gapi.client.drive.files.list with the correct input', function () {
      expect(window.gapi.client.drive.files.list).toHaveBeenCalledWith({
        q: 'name="foo.json"',
        spaces: 'appDataFolder',
        fields: 'files(id)'
      });
    });

    describe('when the app data file exists', function () {
      beforeEach(function () {
        this.deferreds['gapi.client.drive.files.list']
          .resolve({ result: { files: [{ id: 'foo' }] } });
      });

      it('should resolve with the file id', function () {
        expect(this.handler).toHaveBeenCalledWith('foo');
      });
    });

    describe('when the app data file does not exist', function () {
      beforeEach(function () {
        this.deferreds['gapi.client.drive.files.list'].resolve({});
      });

      it('should resolve with null', function () {
        expect(this.handler).toHaveBeenCalledWith(null);
      });
    });
  });
});
