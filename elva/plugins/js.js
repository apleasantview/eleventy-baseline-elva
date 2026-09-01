import elva from '../../src/_data/_elva.js';
import { minify } from 'terser';

export function js(eleventyConfig) {
    eleventyConfig.addBundle('js', { toFileDirectory: 'assets/js', transforms: [
        async function(content) {
            if (elva.isProduction) {
                const minified = await minify(content);
                return minified.code;
            }
            return content;
        }
    ]});
}
