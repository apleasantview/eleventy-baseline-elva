import collections from '../../../_data/types.json' with { type: 'json' };

const config = collections.pages;

export default {
	layout: config.layout,
	tags: ['_pages', ...(config.searchable ? ['_search'] : [])],
	permalink: function (data) {
		let prefix = `/${data.lang}`;
		if (data.locales[data.lang].default) prefix = '';

		return `${prefix}/${this.slugify(data.seo?.slug || data.page.fileSlug)}/`.replace(/\/{2,}/g, '/');
	}
};
