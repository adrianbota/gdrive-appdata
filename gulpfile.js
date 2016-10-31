const createTasks = require('abota-build');

createTasks({
  js: {
    'gdad.js': 'gdad.js'
  },
  dist: [
    'docs/js/gdad.js',
    'docs/js/gdad.js.map'
  ]
});
