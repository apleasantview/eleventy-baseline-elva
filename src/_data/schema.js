// Identity for Baseline's JSON-LD graph. Write `schema`, read `seo`.
// `organization` and `person` are reserved, null means not set. `pieces` passes
// raw schema.org nodes straight through.
import elva from './_elva.js';

export default {
	organization: null,

	// Primary entity, so the WebSite publisher points here. The url sets the
	// @id, which lands on the author's own site rather than this one.
	person: {
		'@type': 'Person',
		name: elva.author.name,
		url: elva.author.url,
		sameAs: [elva.author.githubProfile, elva.author.fediverseProfile].filter(Boolean)
	},

	pieces: []
};
