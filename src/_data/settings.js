// Site identity, as read by the Baseline plugin.
const siteUrl = process.env.URL || process.env.CF_PAGES_URL || 'http://localhost:8080';
const absolute = (path) => new URL(path, siteUrl).href;

export default {
	title: 'elva',
	description: 'A multilingual, clean, green, 11ty starter theme',
	url: siteUrl,

	// Site-wide noindex. elva gates the same behaviour on _elva.isStaging in base.njk.
	noindex: false,

	// Language declarations.
	defaultLanguage: 'en',
	languages: {
		en: {
			contentDir: 'content/en/',
			locale: 'en-gb',
			languageName: 'English',
			title: 'elva',
			description: 'A multilingual, clean, green, 11ty starter theme',
			homeLabel: 'Home'
		},
		sv: {
			contentDir: 'content/sv/',
			locale: 'sv-se',
			languageName: 'Svenska',
			title: 'elva',
			description: 'En flerspråkig, ren, grön, 11ty starter theme',
			homeLabel: 'Hem'
		}
	},

	// Additive <head> entries injected on every page.
	head: {
		link: [{ rel: 'stylesheet', href: '/assets/css/index.css' }],
		script: [{ src: '/assets/js/index.js', defer: true }],
		meta: [],
		style: []
	},

	// SEO OG/Twitter meta values.
	seo: {
		preserveQueryParams: false,
		ogImage: { url: absolute('/assets/img/og/opengraph-default.png'), width: 1200, height: 630, alt: '' },
		openGraph: { type: 'website' },
		twitter: { card: 'summary_large_image' }
	}
};
