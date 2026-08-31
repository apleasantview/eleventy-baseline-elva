import collections from '../_data/types.json' with { type: 'json' };
import slugify from 'slugify';

// Baseline's slugify settings, so the URL segment and Baseline's entry.slug are the same
// string. Eleventy's built-in this.slugify transliterates a-umlaut to 'ae' and o-umlaut to
// 'oe'; Baseline's strips them to 'a' and 'o', which is how Elva's Swedish slugs are written.
const slug = (value) => slugify(String(value), { lower: true, strict: true, trim: true });

// A page's collection is the directory it sits in: /content/<lang>/<type>/<file>.
// Pages outside a collection — humans.njk, redirects.njk, tags.njk — resolve to something
// types.json does not list, and every rule below leaves those alone.
const typeOf = (data) => data.page.filePathStem.split('/').at(-2);

export default {
	eleventyComputed: {
		type: (data) => (collections[typeOf(data)] ? typeOf(data) : data.type)
	},

	// Plain data, not computed, so a page declaring its own permalink still wins.
	permalink: function (data) {
		const type = typeOf(data);
		const config = collections[type];
		if (!config) return undefined;

		const prefix = data.locales[data.lang].default ? '' : `/${data.lang}`;
		const name = slug(data.slug || data.page.fileSlug);

		if (type === 'pages') {
			// index.md is the root of its language, by Eleventy's own filename convention.
			// Tested on filePathStem, not fileSlug: for an index file Eleventy's fileSlug is the
			// parent directory name, so it reads 'pages' here and never 'index'
			// (TemplateFileSlug.js:45).
			if (data.page.filePathStem.split('/').at(-1) === 'index') return `${prefix}/`;

			return `${prefix}/${name}/`;
		}

		const segment = config.locales?.[data.lang] || config.prefix || type;
		return `${prefix}/${segment}/${name}/`;
	}
};
