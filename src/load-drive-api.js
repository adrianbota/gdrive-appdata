module.exports = function loadDriveAPI(version) {
  return gapi.client.load('drive', version);
};
