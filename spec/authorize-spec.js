describe('authorize', function () {
  var authorize = require('../src/authorize');
  var lodashSet = require('../node_modules/lodash/set');

  beforeEach(function () {
    lodashSet(window, 'gapi.auth.authorize', jasmine.createSpy('authorize'));
  });

  describe('Calling authorize with `immediate` arg omitted', function () {
    beforeEach(function () {
      authorize('foo', ['bar', 'baz']);
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
      authorize('baz', ['bar'], true);
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
