describe('Load application data', function () {
  var loadAppData = require('../src/load-app-data');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.handler = jasmine.createSpy('handler');
    this.deferreds = gapiMock();
  });

  describe('Calling loadAppData with a file id arg', function () {
    beforeEach(function () {
      loadAppData('foo').then(this.handler);
    });

    it('should call gapi.client.drive.files.get with the correct input', function () {
      expect(window.gapi.client.drive.files.get).toHaveBeenCalledWith({
        fileId: 'foo',
        alt: 'media'
      });
    });

    describe('when request is successful', function () {
      beforeEach(function () {
        this.deferreds['gapi.client.drive.files.get']
          .resolve({ result: 'fooBar' });
      });

      it('should resolve with the file content', function () {
        expect(this.handler).toHaveBeenCalledWith('fooBar');
      });
    });
  });
});
