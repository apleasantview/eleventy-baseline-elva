// Site identity, as read by the Baseline plugin.
//
// Hand-written. Nothing else should write to this file — the values here are decisions, not
// state. Anything elva itself reads lives in _elva.js.

import fs from 'node:fs';
import path from 'node:path';

import locales from './locales.json' with { type: 'json' };

const strings = (lang) =>
	JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'translations', `${lang}.json`), 'utf-8'));

const defaultLanguage = Object.keys(locales).find((key) => locales[key].default);

// Per-language values come from locales.json and translations/<lang>.json, both of which the CLI
// maintains, so adding a language stays a CLI operation.
//
//   locale        BCP 47 tag, used for <html lang> and og:locale
//   languageName  label in the language switcher
//   title         site title for this language
//   description   fallback meta description
//   homeLabel     first breadcrumb
//   contentDir    where this language's content lives. Baseline never reads it; it is a
//                 documented convention, so that a switcher — or anything else needing to
//                 find a language's content — has one place to ask. Worth having here
//                 because elva infers the same fact in three places (the permalink rule,
//                 the CLI, Front Matter), and this is the only one that states it.
//                 Trailing slash and key order follow the multilingual tutorial.
const languages = Object.fromEntries(
	Object.entries(locales).map(([lang, locale]) => {
		const t = strings(lang);

		return [
			lang,
			{
				contentDir: `content/${lang}/`,
				locale: locale.locale,
				languageName: locale.label,
				title: t.meta?.title,
				description: t.meta?.description,
				homeLabel: t.header?.home
			}
		];
	})
);

export default {
	title: languages[defaultLanguage]?.title,
	description: languages[defaultLanguage]?.description,

	// Must be an absolute http(s) origin. Without it there are no canonicals, no Open Graph and
	// no structured data.
	url: process.env.URL || process.env.CF_PAGES_URL || 'http://localhost:8080',

	defaultLanguage,
	languages
};
