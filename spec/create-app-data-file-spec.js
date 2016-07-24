describe('Create app data file', function () {
  var createAppDataFile = require('../src/create-app-data-file');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.handler = jasmine.createSpy('handler');
    this.deferreds = gapiMock();
  });

  describe('Calling createAppDataFile with a file name arg', function () {
    beforeEach(function () {
      createAppDataFile('foo.json').then(this.handler);
    });

    it('should call gapi.client.drive.files.create with the correct input', function () {
      expect(window.gapi.client.drive.files.create).toHaveBeenCalledWith({
        fields: 'id',
        resource: {
          name: 'foo.json',
          parents: ['appDataFolder']
        }
      });
    });

    describe('when creation is successful', function () {
      beforeEach(function () {
        this.deferreds['gapi.client.drive.files.create']
          .resolve({ result: { id: 'foo' } });
      });

      it('should resolve with the file id', function () {
        expect(this.handler).toHaveBeenCalledWith('foo');
      });
    });
  });
});
