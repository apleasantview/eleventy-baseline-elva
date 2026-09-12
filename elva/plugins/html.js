import elva from '../../src/_data/_elva.js';
import minifyHtml from '@minify-html/node';
import * as cheerio from 'cheerio';
import { Buffer } from 'node:buffer';

export function html(eleventyConfig) {
	eleventyConfig.addTransform('html-minify', (content, path) => {
		if (!path || !path.endsWith('.html')) return content;

		// Fold the <baseline-head> siblings back into <head>. Browsers do it, the file doesn't.
		let repaired;
		try {
			repaired = cheerio.load(content).html();
		} catch (err) {
			console.error('Error repairing HTML:', err);
			repaired = content;
		}

		if (elva.isProduction) {
			try {
				const minified = minifyHtml.minify(Buffer.from(repaired), {
					keep_html_and_head_opening_tags: true,
					keep_closing_tags: true,
					keep_comments: false,
					allow_removing_spaces_between_attributes: false,
					keep_ssi_comments: false,
					minify_css: true,
					minify_js: true,
					preserve_brace_template_syntax: false
				});
				return minified.toString('utf-8');
			} catch (err) {
				console.error('Error minifying HTML:', err);
			}
		}

		return repaired;
	});
}
