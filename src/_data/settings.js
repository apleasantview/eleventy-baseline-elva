// Site identity, as read by the Baseline plugin.
const siteUrl = process.env.URL || process.env.CF_PAGES_URL || 'http://localhost:8080';
const absolute = (path) => new URL(path, siteUrl).href;

export default {
	title: 'elva',
	description: 'A multilingual, clean, green, 11ty starter theme',
	url: siteUrl,

	// Site-wide noindex. elva gates the same behaviour on _elva.isStaging in base.njk.
	noindex: false,

	// Language declarations. `dir` and `shorthand` are elva's own, kept here rather
	// than in locales.json: Baseline passes unknown entry keys through verbatim.
	defaultLanguage: 'en',
	languages: {
		en: {
			contentDir: 'content/en/',
			locale: 'en-gb',
			languageName: 'English',
			title: 'elva',
			description: 'A multilingual, clean, green, 11ty starter theme',
			homeLabel: 'Home',
			dir: 'ltr',
			shorthand: 'EN'
		},
		sv: {
			contentDir: 'content/sv/',
			locale: 'sv-se',
			languageName: 'Svenska',
			title: 'elva',
			description: 'En flerspråkig, ren, grön, 11ty starter theme',
			homeLabel: 'Hem',
			dir: 'ltr',
			shorthand: 'SE'
		}
	},

	// Additive <head> entries injected on every page.
	head: {
		link: [
			{ rel: 'stylesheet', href: '/themes/default/assets/css/index.css' },
			{ rel: 'icon', href: '/favicon.ico', sizes: 'any' },
			{ rel: 'icon', href: '/assets/img/icon.svg', type: 'image/svg+xml' }
		],
		script: [
			{content: "document.documentElement.dataset.theme = localStorage.getItem('theme') === null ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : localStorage.getItem('theme')"},
			{ src: '/themes/default/assets/js/index.js', defer: true }
		],
		meta: [
			{ name: 'text-scale', content: 'scale' },
			{ name: 'color-scheme', content: 'light dark' }
		],
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
