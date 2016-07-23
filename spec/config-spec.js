describe('config', function () {
  var config = require('../src/config');

  it('should have a `scopes` prop as array', function () {
    expect(config.scopes).toEqual(jasmine.any(Array));
  });

  it('should have a `driveVersion` prop as string', function () {
    expect(config.driveVersion).toEqual(jasmine.any(String));
  });
});
