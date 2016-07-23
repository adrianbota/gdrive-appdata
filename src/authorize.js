module.exports = function authorize(clientId, scopes, immediate) {
  return gapi.auth.authorize({
    client_id: clientId,
    scope: scopes.join('\x20'),
    immediate: !!immediate
  });
};
