import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import license from "rollup-plugin-license";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import includePaths from 'rollup-plugin-includepaths';

import pkg from "./package.json" with {
	type: 'json'
};

const plugins = [
	//nodeResolve({
	//	// force css-tree to load CommonJS as ESM use NodeJS specific features
	//	extensions: [".cjs"],
	//	mainFields: ["main"],
	//	resolveOnly: ["css-tree"]
	//}),
	includePaths({
		// css-tree unbundled ESM uses NodeJS specific features
		include: {
			'css-tree': 'node_modules/css-tree/dist/csstree.esm.js'
		},
		extensions: ['.js']
	}),
	nodeResolve({
		extensions: [".cjs",".mjs", ".js"],
		resolveOnly: module => module != "css-tree"
	}),
	commonjs({
		include: "node_modules/**",
	}),
	json(),
	license({
		banner: "@license Paged.js v<%= pkg.version %> | MIT | https://gitlab.coko.foundation/pagedjs/pagedjs",
	}),
	nodePolyfills( /* options */ )
];

export default [
	// browser-friendly UMD build
	{
		input: pkg.main,
		output: {
			name: "Paged",
			file: pkg.browser,
			format: "umd"
		},
		plugins: plugins
	},

	{
		input: pkg.main,
		output: {
			name: "PagedModule",
			file: "./dist/paged.esm.js",
			format: "es"
		},
		plugins: plugins
	},

	{
		input: "./src/polyfill/polyfill.js",
		output: {
			name: "PagedPolyfill",
			file: "./dist/paged.polyfill.js",
			format: "umd"
		},
		plugins: plugins
	},

	// minified
	{
		input: pkg.main,
		output: {
			name: "PagedModule",
			file: "./dist/paged.min.js",
			format: "umd"
		},
    plugins: [plugins, terser()]
	},
	{
		input: "./src/polyfill/polyfill.js",
		output: {
			name: "PagedPolyfill",
			file: "./dist/paged.polyfill.min.js",
			format: "umd"
		},
		plugins: [plugins, terser()]
	},
];
