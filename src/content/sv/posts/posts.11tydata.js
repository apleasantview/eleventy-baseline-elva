import collections from '../../../_data/types.json' with { type: 'json' };

const config = collections.posts;

// Layout and tags stay next to the content they describe, as plain data, so the cascade
// merges them with a page's own front matter. Layout in particular cannot be hoisted into
// src/content/content.11tydata.js: a computed layout overrides front matter, so pages
// choosing their own (index.md, documentation.md) would lose it, and a computed layout that
// reads data.layout to avoid that silently resolves to nothing.
export default {
	layout: config.layout,
	tags: ['_posts', ...(config.searchable ? ['_search'] : [])]
};
