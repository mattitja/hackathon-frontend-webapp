const openProps = require('open-props');
const customMediaUrl = require.resolve('open-props/media');
const postcssPresetEnv = require("postcss-preset-env");
const postcssImport = require("postcss-import");
const combineSelectors = require("postcss-combine-duplicated-selectors");
const postcssJitProps = require('postcss-jit-props');
const postcssGlobalData = require('@csstools/postcss-global-data');
const postcssMinify = require('@csstools/postcss-minify');

module.exports = {
  plugins: [
    postcssImport(),
    postcssGlobalData({
			files: [customMediaUrl],
		}),
    postcssPresetEnv({
      stage: 0,
      autoprefixer: false,
      features: {
        "logical-properties-and-values": false,
        "prefers-color-scheme-query": false,
        "gap-properties": false,
        "custom-properties": false,
        "place-properties": false,
        "not-pseudo-class": false,
        "focus-visible-pseudo-class": false,
        "focus-within-pseudo-class": false,
        "color-functional-notation": false,
      },
    }),
    postcssJitProps(openProps),
    combineSelectors(),
    postcssMinify(),
  ],
};