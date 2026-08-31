import collections from '../../../_data/types.json' with { type: 'json' };
import slugify from 'slugify';

const collectionName = import.meta.url.split('/').at(-2);
const config = collections[collectionName];

// Baseline's slugify settings, so the URL segment and Baseline's entry.slug are the same
// string. Eleventy's built-in this.slugify transliterates a-umlaut to 'ae' and o-umlaut to
// 'oe'; Baseline's strips them to 'a' and 'o', which is how Elva's Swedish slugs are written.
const slug = (value) => slugify(String(value), { lower: true, strict: true, trim: true });

export default {
    layout: config.layout,
    tags: [`_${collectionName}`, ...(config.searchable ? ['_search'] : [])],
    permalink: function(data) {
        let prefix = `/${data.lang}`;
        if (data.locales[data.lang].default) prefix = '';

        if (collectionName === 'pages') {
            return `${prefix}/${slug(data.slug || data.page.fileSlug)}/`.replace(/\/{2,}/g, '/');
        }

        let collectionSlug = config.locales?.[data.lang] || config.prefix || collectionName;
        return `${prefix}/${collectionSlug}/${slug(data.slug || data.page.fileSlug)}/`;
    }
}
