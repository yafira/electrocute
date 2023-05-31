const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	compiler: {
		styledComponents: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
	) => {
		plugins: [
			(config.module.generator.asset.publicPath = '/_next/'),
			new MiniCssExtractPlugin({
				experimentalUseImportModule: false,
			}),
		]
		return config
	},
}
