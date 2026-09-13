// calculate the time to read of a chunk of text (to the nearest minute)
// based on https://www.bobmonsour.com/posts/calculating-reading-time/
// returns the number of minutes; the caller picks the string, because Baseline's
// `t` is a registered filter and its lookup is not importable.
export function readingtime(text) {
	let content = new String(text);
	const speed = 240; // reading speed in words per minute

	// remove all html elements
	let re = /(&lt;.*?&gt;)|(<[^>]+>)/gi;
	let plain = content.replace(re, '');

	// replace all newlines and 's with spaces
	plain = plain.replace(/\s+|'s/g, ' ');

	// create array of all the words in the post & count them
	let words = plain.split(' ');
	let count = words.length;

	return Math.round(count / speed);
}
