describe('Initial requests before any load/save app data calls', function () {
  var appDataInitRequests = require('../src/app-data-init-requests');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.deferreds = gapiMock();
  });

  describe('Running the initial requests', function () {
    beforeEach(function () {
      this.promise = appDataInitRequests({
        clientId: 'foo',
        scopes: ['bar'],
        immediateAuth: true,
        appDataFileName: 'foo.json',
        driveVersion: 'v3'
      }).then(function (fileId) {
        this.fileId = fileId;
      }.bind(this));
    });

    describe('when immediate authorization is successful', function () {
      beforeEach(function () {
        this.deferreds['gapi.auth.authorize'].resolve();
      });

      describe('and drive API loads successfuly', function () {
        beforeEach(function () {
          this.deferreds['gapi.client.load'].resolve();
        });

        describe('and app data file exists', function () {
          beforeEach(function () {
            this.deferreds['gapi.client.drive.files.list']
              .resolve({ result: { files: [{ id: 'foo' }] } });
          });

          it('should retrieve the app data file id', function () {
            expect(this.fileId).toBe('foo');
          });
        });

        describe('and app data file does not exist', function () {
          beforeEach(function () {
            this.deferreds['gapi.client.drive.files.list'].resolve({});
            this.deferreds['gapi.client.drive.files.create']
              .resolve({ result: { id: 'bar' } });
          });

          it('should create the app data file and retrieve its id', function () {
            expect(this.fileId).toBe('bar');
          });
        });
      });
    });
  });
});
