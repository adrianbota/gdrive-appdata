describe('Google Drive App Data', function () {
  var index = require('../src/index');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.deferreds = gapiMock();
  });

  it('should have a configuration object', function () {
    expect(index.config).toEqual(jasmine.any(Object));
  });

  describe('loadAppData with immediate auth set to false', function () {
    beforeEach(function () {
      index.config.immediateAuth = false;
      index.loadAppData();
      this.deferreds['gapi.auth.authorize'].resolve();
      this.deferreds['gapi.client.load'].resolve();
      this.deferreds['gapi.client.drive.files.list']
        .resolve({ result: { files: [{ id: 'foo' }] } });
    });

    it('should call authorize with immediate set to false', function () {
      expect(window.gapi.auth.authorize).toHaveBeenCalledWith(jasmine.objectContaining({
        immediate: false
      }));
    });

    describe('on a second call', function () {
      beforeEach(function () {
        index.loadAppData();
      });

      it('should call authorize with immediate flag reset to true', function () {
        expect(window.gapi.auth.authorize).toHaveBeenCalledWith(jasmine.objectContaining({
          immediate: true
        }));
      });
    });
  });

  describe('saveAppData with immediate auth set to false', function () {
    beforeEach(function () {
      index.config.immediateAuth = false;
      index.saveAppData({});
      this.deferreds['gapi.auth.authorize'].resolve();
      this.deferreds['gapi.client.load'].resolve();
      this.deferreds['gapi.client.drive.files.list']
        .resolve({ result: { files: [{ id: 'foo' }] } });
    });

    it('should call authorize with immediate set to false', function () {
      expect(window.gapi.auth.authorize).toHaveBeenCalledWith(jasmine.objectContaining({
        immediate: false
      }));
    });

    describe('on a second call', function () {
      beforeEach(function () {
        index.loadAppData();
      });

      it('should call authorize with immediate flag reset to true', function () {
        expect(window.gapi.auth.authorize).toHaveBeenCalledWith(jasmine.objectContaining({
          immediate: true
        }));
      });
    });
  });
});
