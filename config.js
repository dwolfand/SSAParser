exports.config = {
  paths: {
    watched: ['app', 'vendor']
  },
  files: {
    javascripts: {
      joinTo: {
        'scripts/app.js': /^(app)/,
        'scripts/vendor.js': /^(vendor(\/||\\)scripts)/
      },
      order: {
        before: [
          'vendor/scripts/jquery.min.js',
          'vendor/scripts/datatables.js',
          'vendor/scripts/datatablebootstrap.js',
          'vendor/scripts/bignumber.js',
          'vendor/scripts/pdf.js',
          'vendor/scripts/pdf.worker.js'
        ]
      }
    },
    stylesheets: {
      joinTo: {
        'stylesheets/app.css': /^(app|vendor(\/||\\)styles)/
      }
    },
    templates: {
      precompile: true,
      root: 'templates',
      joinTo: {
        'javascripts/app.js': /^app/
      }
    }
  },
  overrides: {
  }
};
