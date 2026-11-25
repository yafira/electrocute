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
	async rewrites() {
		return [
			{ source: '/neural-nectar', destination: 'https://neural-nectar.vercel.app' },
			{ source: '/neural-nectar/:path*', destination: 'https://neural-nectar.vercel.app/:path*' },
			{ source: '/synthwave-chimes', destination: 'https://synthwave-chimes.netlify.app' },
			{ source: '/synthwave-chimes/:path*', destination: 'https://synthwave-chimes.netlify.app/:path*' },
			{ source: '/fluoro', destination: 'https://fluoro-riso.vercel.app' },
			{ source: '/fluoro/:path*', destination: 'https://fluoro-riso.vercel.app/:path*' },
			{ source: '/punchcard', destination: 'https://punchcard-studio.vercel.app' },
			{ source: '/punchcard/:path*', destination: 'https://punchcard-studio.vercel.app/:path*' },
			{ source: '/altloom', destination: 'https://alt-loom.vercel.app' },
			{ source: '/altloom/:path*', destination: 'https://alt-loom.vercel.app/:path*' },
			{ source: '/tinkerthread', destination: 'https://tinkerthread.netlify.app' },
			{ source: '/tinkerthread/:path*', destination: 'https://tinkerthread.netlify.app/:path*' },
			{ source: '/pixel-picnic', destination: 'https://pixel-picnic.vercel.app' },
			{ source: '/pixel-picnic/:path*', destination: 'https://pixel-picnic.vercel.app/:path*' },
			{ source: '/soft-queue', destination: 'https://soft-queue-app.vercel.app' },
			{ source: '/soft-queue/:path*', destination: 'https://soft-queue-app.vercel.app/:path*' },
		]
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
