describe('retrieveAppDataFileId', function () {
  var defer = require('deferred');
  var lodashSet = require('lodash/set');
  var retrieveAppDataFileId = require('../src/retrieve-app-data-file-id');

  beforeEach(function () {
    this.deferred = defer();
    this.handler = jasmine.createSpy('handler');
    this.list = jasmine.createSpy('list').and.returnValue(this.deferred.promise);
    lodashSet(window, 'gapi.client.drive.files.list', this.list);
  });

  describe('Calling retrieveAppDataFileId with a file name arg', function () {
    beforeEach(function () {
      retrieveAppDataFileId('foo.json').then(this.handler);
    });

    it('should call gapi.client.drive.files.list with the correct input', function () {
      expect(this.list).toHaveBeenCalledWith({
        q: 'name="foo.json"',
        spaces: 'appDataFolder',
        fields: 'files(id)'
      });
    });

    describe('when the app data file exists', function () {
      beforeEach(function () {
        this.response = {};
        lodashSet(this.response, 'result.files[0].id', 'foo');
        this.deferred.resolve(this.response);
      });

      it('should resolve with the file id', function () {
        expect(this.handler).toHaveBeenCalledWith('foo');
      });
    });

    describe('when the app data file does not exist', function () {
      beforeEach(function () {
        this.deferred.resolve({});
      });

      it('should resolve with null', function () {
        expect(this.handler).toHaveBeenCalledWith(null);
      });
    });
  });
});
