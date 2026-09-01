// @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig 

// Imports --------------------------------------------

import { EleventyI18nPlugin, EleventyHtmlBasePlugin, EleventyRenderPlugin, IdAttributePlugin } from '@11ty/eleventy';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fs from 'fs';
import markdownItAttrs from 'markdown-it-attrs';
import markdownIt from 'markdown-it';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItToc from 'markdown-it-table-of-contents';
import markdownItImageFigures from 'markdown-it-image-figures';
import path from 'path';
import pluginRSS from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginEmbedEverything from 'eleventy-plugin-embed-everything';
import slugify from '@sindresorhus/slugify';

// Local ---------------------------------------------

// Plugin Configs
import pluginEmbedEverythingConfig from './elva/config/embeds.js';
import pluginImageTransformConfig from './elva/config/images.js';

// Auto-import utilities
import { autoImportFilters, autoImportPlugins } from './elva/utils/autoimport.js';

// Languages
import locales from './src/_data/locales.json' with { type: 'json' }
const defaultLanguage = Object.keys(locales).find(key => locales[key].default);

// Settings
// _elva.js holds what the starter reads; settings.js holds Baseline's contract and is
// imported by the plugin registration rather than here. D9.
import elva from './src/_data/_elva.js';

// Collections
const collections = await import('./src/_data/types.json', { with: { type: 'json' } });

// 11ty -----------------------------------------------

export default async function(eleventyConfig) {

    // Watch Targets ----------------------------------

    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.addWatchTarget('./src/assets');
    eleventyConfig.addWatchTarget('./src/themes/**/*.{css,js}');
    eleventyConfig.addWatchTarget('./elva/templates/*', { resetConfig: true });
    eleventyConfig.addWatchTarget(`./src/themes/${elva.theme}/_layouts/opengraph-preview.njk`, { resetConfig: true });

    // Virtual Templates ------------------------------

    // development only open graph template
    if (process.env.ELEVENTY_RUN_MODE && process.env.ELEVENTY_RUN_MODE !== 'build') {
        const ogPreviewTemplate = fs.readFileSync(path.resolve(`src/themes/${elva.theme}/_layouts/`, 'opengraph-preview.njk'), 'utf-8');
        eleventyConfig.addTemplate('opengraph-preview.njk', ogPreviewTemplate, { theme: elva.theme });
    }

    const robotsTemplate = fs.readFileSync(path.resolve('elva/templates/', 'robots.njk'), 'utf-8');
    const sitemapTemplate = fs.readFileSync(path.resolve('elva/templates/', 'sitemap.njk'), 'utf-8');
    const sitemapIndexTemplate = fs.readFileSync(path.resolve('elva/templates/', 'sitemap-index.njk'), 'utf-8');

    eleventyConfig.addTemplate('robots.njk', robotsTemplate);
    // with more than one language, generate a sitemap-index.xml
    if (Object.keys(locales).length > 1) {
        eleventyConfig.addTemplate('sitemap-index.njk', sitemapIndexTemplate);
    }

    const manifestTemplate = fs.readFileSync(path.resolve('elva/templates/', 'manifest.njk'), 'utf-8');
    const blogrollXMLTemplate = fs.readFileSync(path.resolve('elva/templates/', 'blogroll.xml.njk'), 'utf-8');
    const searchApiTemplate = fs.readFileSync(path.resolve('elva/templates/', 'search.json.njk'), 'utf-8');
    const feedXslTemplate = fs.readFileSync(path.resolve('elva/templates/', 'feed.xsl.njk'), 'utf-8');

    for (let [key, locale] of Object.entries(locales)) {
        eleventyConfig.addTemplate(key + '-sitemap.njk', sitemapTemplate, { lang: key });
        eleventyConfig.addTemplate(key + '-manifest.njk', manifestTemplate, { lang: key });
        eleventyConfig.addTemplate(key + '-blogroll.xml.njk', blogrollXMLTemplate, { lang: key });
        eleventyConfig.addTemplate(key + '-search-api.json.njk', searchApiTemplate, { lang: key, collection: '_search' });
        eleventyConfig.addTemplate(key + '-feed.xsl.njk', feedXslTemplate, { lang: key });

        for (let [collectionName, config] of Object.entries(collections.default)) {
            if (!config.feed) continue;

            const feedXmlTemplate = fs.readFileSync(path.resolve('elva/templates/', 'feed.xml.njk'), 'utf-8');
            const feedJsonTemplate = fs.readFileSync(path.resolve('elva/templates/', 'feed.json.njk'), 'utf-8');
            
            const feedSlug = collectionName === 'posts' ? 'feed' : collectionName;
            // eleventyImport is how Eleventy learns this template consumes that collection.
            // Without it the feed can render before the posts do, and reading
            // post.templateContent throws TemplateContentPrematureUseError.
            const feedData = { lang: key, collectionName, collectionTag: `_${collectionName}`, eleventyImport: { collections: [`_${collectionName}`] }, label: config.label, feedSlug };
            eleventyConfig.addTemplate(key + '-' + collectionName + '-feed.xml.njk', feedXmlTemplate, feedData);
            eleventyConfig.addTemplate(key + '-' + collectionName + '-feed.json.njk', feedJsonTemplate, feedData);
        }
    }
    
    // Plugins ----------------------------------------

    await autoImportPlugins(eleventyConfig);
    await eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(EleventyI18nPlugin, { defaultLanguage: defaultLanguage, errorMode: 'never'});
    eleventyConfig.addPlugin(IdAttributePlugin);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginEmbedEverything, pluginEmbedEverythingConfig);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, pluginImageTransformConfig(eleventyConfig));
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Transforms -------------------------------------

    // await autoImportTransforms(eleventyConfig);

    // Shortcodes -------------------------------------

    // await autoImportShortcodes(eleventyConfig);
    eleventyConfig.addShortcode('version', () => `${+ new Date()}`);
    eleventyConfig.addShortcode('year', () => `${elva.year}`);
    eleventyConfig.addShortcode('build', () => `${new Date().toISOString().split('T')[0]}`);

    // Filters ----------------------------------------

    await autoImportFilters(eleventyConfig);

    // Passthrough -------------------------------------

    eleventyConfig.addPassthroughCopy({'./src/assets/img/favicon.ico': './favicon.ico'});
    eleventyConfig.addPassthroughCopy({'./src/assets/img': './assets/img'});
    eleventyConfig.addPassthroughCopy({'./src/assets/svg': './assets/svg'});
    eleventyConfig.addPassthroughCopy({[`./src/themes/${elva.theme}/fonts`]: './assets/fonts'});

    // Markdown ----------------------------------------

   eleventyConfig.setLibrary('md', markdownIt({
        html: true,
        linkify: true,
        typographer: true
    }));

    eleventyConfig.amendLibrary('md', (mdLib) => {
        mdLib.use(markdownItIns);
        mdLib.use(markdownItMark);
        mdLib.use(markdownItSub);
        mdLib.use(markdownItSup);
        mdLib.use(markdownItAnchor, {slugify});
        mdLib.use(markdownItAttrs);
        mdLib.use(markdownItImageFigures, { figcaption: true });
        mdLib.use(markdownItToc, {slugify, includeLevel: [2,3]});
    });

    // 11ty Settings -----------------------------------

    eleventyConfig.logger.message(`Theme: ${elva.theme}`);

    return {
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    
        // If your site deploys to a subdirectory, change `pathPrefix`
        pathPrefix: '/',

        dir: {
            input: 'src',
            output: 'dist',
            data: '_data',
            includes: `themes/${elva.theme}/_includes`,
            layouts: `themes/${elva.theme}/_layouts`
        }
    }
}