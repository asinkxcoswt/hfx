module.exports = function(grunt) {

	// tell grunt to load jshint task plugin.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// configure tasks
	grunt.initConfig({
		jshint : {
			files : [ 
				'GruntFile.js', 
				'src/main/resources/static/js/**/*.js', 
				],
			options : {
				ignores : []
			}
		}
	// more plugin configs go here.
	});

	grunt.registerTask('default', [ 
//		'jshint' 
	]);

};