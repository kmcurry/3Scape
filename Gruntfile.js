module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'public/js/Bridgeworks-min.js',
        dest: 'public/js/build/Bridgeworks-min.js'
      }
    },
    svgstore: {
      options: {
        prefix : 'shape-', // This will prefix each <g> ID
      },
      default : {
          files: {
            'public/images/svg-defs.svg': ['public/images/*.svg'],
          }
        }
      }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-svgstore');

  // Default task(s).
  grunt.registerTask('default', ['svgstore']);

};
