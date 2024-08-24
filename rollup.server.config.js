import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import includePaths from 'rollup-plugin-includepaths';

const plugins = [
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
		include: ["node_modules/**"]
	}),
	json(),
	serve({
		port: 9090,
		contentBase: "./",
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Service-Worker-Allowed": "/",
		}
	}),
	livereload({
		watch: ["dist", "examples"]
	})
];

export default [
	{
		input: "./src/polyfill/polyfill.js",
		output: {
			name: "PagedPolyfill",
			file: "./dist/paged.polyfill.js",
			format: "umd"
		},
		plugins: plugins
	}
];
