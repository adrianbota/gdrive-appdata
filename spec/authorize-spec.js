describe('Authorization for using Google API', function () {
  var authorize = require('../src/authorize');
  var gapiMock = require('./gapi-mock');

  beforeEach(function () {
    this.deferreds = gapiMock();
  });

  describe('Calling authorize with `immediate` arg omitted', function () {
    beforeEach(function () {
      authorize({
        clientId: 'foo',
        scopes: ['bar', 'baz']
      });
    });

    it('should call gapi.auth.authorize with the correct input', function () {
      expect(window.gapi.auth.authorize).toHaveBeenCalledWith({
        client_id: 'foo',
        scope: 'bar baz',
        immediate: false
      });
    });
  });

  describe('Calling authorize with `immediate` arg set to true', function () {
    beforeEach(function () {
      authorize({
        clientId: 'baz',
        scopes: ['bar'],
        immediateAuth: true
      });
    });

    it('should call gapi.auth.authorize with the correct input', function () {
      expect(window.gapi.auth.authorize).toHaveBeenCalledWith({
        client_id: 'baz',
        scope: 'bar',
        immediate: true
      });
    });
  });
});
