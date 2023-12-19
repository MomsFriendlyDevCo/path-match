export default class RoutePath {
	/**
	* Path expressions to match against
	* @type {String|RegExp|Function|Array}
	*/
	paths = [];


	/**
	* Human readable version of the route path segments
	* Computed during setPaths()
	* @type {Array<String>}
	*/
	pathStrings = '';


	/**
	* Populate / replace the existing path store
	* @param {String|RegExp|Function|Array} paths The incoming path(s) which can be a string, RegExp, function or array of the same
	*
	* @returns {RoutePath} This chainable instance
	*/
	setPaths(paths) {
		[this.paths, this.pathStrings] = (Array.isArray(paths) ? paths : [paths])
			.map(path =>
				// Compose each path into [matcher:RegExp|Function, humanReadable:String]
				path instanceof RegExp ? [path, `[RE:${path.toString()}]`]
				: typeof path == 'function' ? [path, '[Function]']
				: [RoutePath.compileRegExp(path), path]
			)
			.reduce((t, v) => { // Unzip into 2x arrays
				t[0].push(v[0]);
				t[1].push(v[1]);
				return t;
			}, [[], []]);

		return this;
	}


	/**
	* Process whether an incoming candidate path is a match
	*
	* @param {String} path Incoming candidate path
	*
	* @returns {Object|Boolean} candidate Either an object of extracted values, an empty object (if none to extract) or boolean `false` if no match
	*/
	isMatch(candidate) {
		for (let path of this.paths) {
			if (path instanceof RegExp) { // Compare as RegExp
				let result = path.exec(candidate);
				if (result !== null) return result.groups || {}; // Return groups or empty POJO
			} else { // Assume function matcher
				return path(candidate);
			}
		}
		return false;
	}


	/**
	* Return a human readable version of the RoutePath object
	*
	* @returns {String} A human readable description of the path matcher
	*/
	toString() {
		return this.pathStrings
			.join(' OR ')
	}


	/**
	* Compile an incoming path expression string into a JS standard Regular Expression with grouping
	*
	* @param {String} path The path expression to compile
	* @returns {RegExp} A regexp compiled with groupings
	*/
	static compileRegExp(path) {
		return new RegExp(
			'^' + path
				.replace(
					/:([a-z0-9_]+\??)/ig,
					(all, id) =>
						id.endsWith('?') // Optional expression?
							? `(?<${id.replace(/\?$/, '')}>.+)?`
							: `(?<${id}>.+?)`
				)
			+ (path == '/' ? '$' : '\/?$')
		, 'i');
	}


	/**
	* Constructor
	*
	* @param {*} paths Initial paths to set
	*/
	constructor(paths) {
		this.setPaths(paths);
	}
}

/**
* Utlity function to create a route and quickly compare an incoming path
*
* @param {String|RegExp|Function|Array<String>} route Route(s) to compare
* @param {String} path Incoming path to compare against
*
* @returns {Boolean|Object} Either an object containing extracted values (or an empty object) or boolean `false` for no match
*/
export function compare(route, path) {
	let routePath = new RoutePath(route);
	return routePath.isMatch(path);
}


/**
* Utility function to return a new, compiled RoutePath instance
*
* @param {String|RegExp|Function|Array<String>} route Route(s) to intialize with
*
* @returns {RoutePath} An initalized RoutePath object
*/
export function compile(route) {
	return new RoutePath(route);
}
