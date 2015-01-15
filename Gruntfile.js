module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yy") %> */\n',
        beautify : {
          ascii_only : true
        },
        sourceMap: true
      },
      dist: {
        files: {
          'js/main.min.js': ['target/app.js']
        }
      }
    },
    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'target/app.js',
        options: {
          target: 'es5',
          basePath: 'src/',
          sourceMap: true,
          declaration: true
        }
      }
    },
    jasmine : {
      options: {
        specs: 'test/*.js'
      }
    }/*,
    jshint: {
      files: ['test/*.js'],
      options: {
        globals: {
          console: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }*/
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  //grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jasmine']);

  grunt.registerTask('default', ['typescript', 'uglify']);

};

// vim ts=2
