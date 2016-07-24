describe('Default configuration', function () {
  var defaultConfig = require('../src/default-config');

  it('should have a `scopes` prop as array', function () {
    expect(defaultConfig.scopes).toEqual(jasmine.any(Array));
  });

  it('should have a `clientId` prop as null', function () {
    expect(defaultConfig.clientId).toBe(null);
  });

  it('should have a `driveVersion` prop as string', function () {
    expect(defaultConfig.driveVersion).toEqual(jasmine.any(String));
  });

  it('should have a `appDataFileName` prop as string', function () {
    expect(defaultConfig.appDataFileName).toEqual(jasmine.any(String));
  });

  it('should have a `immediateAuth` prop as true', function () {
    expect(defaultConfig.immediateAuth).toBe(true);
  });
});
