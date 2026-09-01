// Everything elva itself reads. Site identity that the Baseline plugin reads lives in
// settings.js; the underscore marks this as a namespace rather than site data.

const mode = process.env.ELEVENTY_ENV;

export default {
	// Derived from the environment at build time, not configuration. The plugins in elva/plugins
	// read isProduction to decide whether to minify and whether to drop drafts.
	isProduction: mode === 'production',
	isStaging:
		(process.env.URL && process.env.URL.includes('github.io')) ||
		(process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main') ||
		mode === 'staging' ||
		false,
	year: new Date().getFullYear(),

	// Which directory under src/themes/ the includes, layouts and assets resolve to.
	theme: process.env.ELVA_THEME || 'default',

	// Route images through a CDN in production and staging builds.
	cdn: false,

	themeColorLight: '#eceff4',
	themeColorDark: '#2e3440',

	author: {
		name: 'Scott Evans',
		email: 'noreply@example.com',
		url: 'https://scott.ee',
		location: 'Stockholm, Sweden',
		fediverseProfile: 'https://toot.scott.ee/@scott',
		fediverseUsername: '@scott@toot.scott.ee',
		githubProfile: 'https://github.com/scottsweb'
	},

	meta: {
		separator: '•',
		opengraphDefaultImage: '/assets/img/og/opengraph-default.png'
	},

	// Sitemap defaults, applied where a page sets no seo.changeFrequency or seo.sitemapPriority
	// of its own. Distinct from settings.seo, which is the plugin's.
	seo: {
		defaultChangeFrequency: 'monthly',
		defaultPriority: '0.7'
	},

	manifest: {
		themeColor: '#eceff4',
		backgroundColor: '#eceff4',
		display: 'minimal-ui',
		orientation: 'portrait-primary',
		categories: ['business', 'photo']
	}
};
