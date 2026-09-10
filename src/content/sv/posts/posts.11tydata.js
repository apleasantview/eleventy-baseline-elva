import collections from '../../../_data/types.json' with { type: 'json' };

const config = collections.posts;

export default {
	layout: config.layout,
	tags: ['_posts', ...(config.searchable ? ['_search'] : [])],
	permalink: function (data) {
		let prefix = `/${data.lang}`;
		if (data.locales[data.lang].default) prefix = '';

		let collectionSlug = config.locales?.[data.lang] || config.prefix || 'posts';
		return `${prefix}/${collectionSlug}/${this.slugify(data.seo?.slug || data.page.fileSlug)}/`;
	}
};
