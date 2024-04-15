module.exports = function(grunt) {

    // Load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    var sass = require('sass');

    //Project configuration
    grunt.initConfig({

        // - SASS
        sass: {
            options: {
                implementation: sass,
                sourceMap: true,
            },
            dist: {
                files: {
                    'assets/styles/main.css' : 'assets/styles/main.scss'
                }
            }
        },

        // - CSS Minifier
        cssmin: {
            target: {
                options: {
                    sourceMap: true,
                    root: 'assets/styles/main.css'
                },
                files: [{
                    src: 'assets/styles/main.css',
                    dest: 'app/public/css/min.css',
                }]
            }
        },

        // - Concat
        concat: {
            options : {
                separator : '',
                sourceMap: true
            },
            js : { // - nom de la tâche
                // src : config.js.scripts_order,
                src :  [

                    "assets/scripts/vars.js",
                    "assets/scripts/intro.js",
                    "assets/scripts/magneticFX.js",
                    "assets/scripts/mouse.js",
                    "assets/scripts/scroll.js",
                    "assets/scripts/menu.js",
                    "assets/scripts/experiences.js",
                    "assets/scripts/lerping.js",
                    "assets/scripts/discover-image.js",
                    "assets/scripts/scroll-bar-width.js",
                    "assets/scripts/lightbox-lerping.js",

                    // - Classes
                    "assets/scripts/classes/*.js",

                    // - App main file
                    "assets/scripts/app.js",

                    "!assets/scripts/_main.js"

                ],
                dest : 'assets/scripts/_main.js'
            }
        },

        // - JS Minifier
        uglify: {
            target: {
                files: {
                    'app/public/js/min.js' : 'assets/scripts/_main.js'
                }
            }
        },

        // - JSHint
        jshint: {
            files: ['Gruntfile.js', 'assets/scripts/**/*.js', '!assets/scripts/main.js'],
            options: {
                esversion: 6
            }
        },

        // - Watcher
        watch: {
            css: {
                files: ['assets/**/*.scss', 'app/public/css/main.css'],
                tasks: ['sass', 'cssmin']
            },
            js: {
                files: ['assets/**/*.js', '!assets/scripts/_main.js', '!assets/scripts/main.js', 'app/public/js/main.js'],
                // tasks: ['jshint', 'concat:js', 'uglify']
                tasks: ['concat:js', 'uglify']
            }
        }

    });

    grunt.registerTask('default', ['watch']);

};
