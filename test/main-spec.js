var gdad = require('../src/js/main');
var gapiMock = require('./gapi-mock');

describe('Google Drive App Data (gdad)', function () {
  beforeEach(function () {
    this.appData = gdad('foo.json', 'barId');
  });

  describe('first call to read', function () {
    beforeEach(function () {
      this.gapiMock = gapiMock();
      this.appData.read();
    });

    it('should authorize immediately with the correct config', function () {
      expect(gapi.auth.authorize).toHaveBeenCalledWith({
        client_id: 'barId',
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
        immediate: true
      });
    });

    describe('when immediate authorize fails', function () {
      beforeEach(function () {
        this.gapiMock.reject('gapi.auth.authorize');
      });

      describe('second call to read', function () {
        beforeEach(function () {
          this.gapiMock = gapiMock();
          this.appData.read().then(function (data) {
            this.data = data;
          }.bind(this));
        });

        it('should authorize via popup', function () {
          expect(gapi.auth.authorize).toHaveBeenCalledWith(
            jasmine.objectContaining({ immediate: false })
          );
        });

        describe('when popup authorize is successful', function () {
          beforeEach(function () {
            this.gapiMock.resolve('gapi.auth.authorize');
          });

          it('should load drive api', function () {
            expect(gapi.client.load).toHaveBeenCalledWith('drive', 'v3');
          });

          describe('when drive api is loaded', function () {
            beforeEach(function () {
              this.gapiMock.resolve('gapi.client.load');
            });

            it('should get the file id', function () {
              expect(gapi.client.drive.files.list).toHaveBeenCalledWith({
                q: 'name="foo.json"',
                spaces: 'appDataFolder',
                fields: 'files(id)'
              });
            });

            describe('when file does not exist', function () {
              beforeEach(function () {
                this.gapiMock.resolve('gapi.client.drive.files.list', null);
              });

              it('should create it', function () {
                expect(gapi.client.drive.files.create).toHaveBeenCalledWith({
                  fields: 'id',
                  resource: { name: 'foo.json', parents: ['appDataFolder'] }
                });
              });

              describe('when file is created', function () {
                beforeEach(function () {
                  this.gapiMock.resolve('gapi.client.drive.files.create', { result: { id: 'foo' } });
                });

                it('should read it', function () {
                  expect(gapi.client.drive.files.get).toHaveBeenCalledWith({
                    fileId: 'foo',
                    alt: 'media'
                  });
                });

                describe('when read is successful', function () {
                  beforeEach(function () {
                    this.gapiMock.resolve('gapi.client.drive.files.get', { result: { foo: 'bar' } });
                  });

                  it('should retrieve the data', function () {
                    expect(this.data).toEqual({
                      foo: 'bar'
                    });
                  });
                });
              });
            });

            describe('when file exists', function () {
              beforeEach(function () {
                this.gapiMock.resolve('gapi.client.drive.files.list', { result: { files: [{ id: 'foo' }] } });
              });

              it('should read it', function () {
                expect(gapi.client.drive.files.get).toHaveBeenCalledWith({
                  fileId: 'foo',
                  alt: 'media'
                });
              });
            });
          });

          describe('third call to read', function () {
            beforeEach(function () {
              this.gapiMock = gapiMock();
              this.appData.read();
            });

            it('should again authorize immediately', function () {
              expect(gapi.auth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({ immediate: true })
              );
            });
          });
        });
      });
    });
  });

  describe('save', function () {
    beforeEach(function () {
      this.data = { foo: 'bar' };
      this.gapiMock = gapiMock();
      this.appData.save(this.data);
      this.gapiMock.resolve('gapi.auth.authorize');
      this.gapiMock.resolve('gapi.client.load');
      this.gapiMock.resolve('gapi.client.drive.files.list', { result: { files: [{ id: 'foo' }] } });
    });

    it('should save data', function () {
      expect(gapi.client.request).toHaveBeenCalledWith({
        path: '/upload/drive/v3/files/foo',
        method: 'PATCH',
        params: { uploadType: 'media' },
        body: JSON.stringify(this.data)
      });
    });
  });
});
