const
path = require("path");
const
packageJSON = require("./package.json");

module.exports = {
	context : path.resolve(__dirname, "src/main/resources/static/js"),
	entry : {
		"hotfix/hotfix-tracking" : "./hotfix/hotfix-tracking.jsx",
		"mail/mail": "./mail/mail.jsx"
	},
	output : {
		path : path.join(__dirname, 'target', 'classes', 'META-INF', 'resources', 'webjars', packageJSON.name),
		filename : "[name].js"
	},
	resolve : {
		modules : [ path.resolve('./src/main/resources/static/js'), path.resolve('./node_modules') ],
		extensions : [ '', '.js', '.jsx' ]
	},
	module : {
		loaders : [ {
			test : /\.jsx$/,
			include : [ path.resolve(__dirname, "src/main/resources/static/js") ],
			loader : 'babel-loader',
			query : {
				cacheDirectory : true,
				plugins : [ 'transform-runtime' ],
				presets : [ 'es2015', 'stage-0', 'react' ]
			}
		} ]
	}
}