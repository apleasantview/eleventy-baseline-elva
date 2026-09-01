import elva from '../../src/_data/_elva.js';
export function drafts(eleventyConfig) {
	let logged = false;

	eleventyConfig.addPreprocessor('drafts', 'njk,md', (data) => {
		return data._elva.isProduction && data.draft ? false : undefined;
	});

	eleventyConfig.on('eleventy.before', () => {
		let text = 'Including';

		if (elva.isProduction) {
			text = 'Excluding';
		}

		if (!logged) {
			eleventyConfig.logger.message(`${text} drafts`);
		}

		logged = true;
	});
}
