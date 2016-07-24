module.exports = function authorize(config) {
  return gapi.auth.authorize({
    client_id: config.clientId,
    scope: config.scopes.join('\x20'),
    immediate: !!config.immediateAuth
  });
};
