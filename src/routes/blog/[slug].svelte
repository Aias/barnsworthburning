<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		let { slug } = page.params;

		const post = await this.fetch(
			`${FULL_API}/airtableGet?base=portfolio&table=blog&id=${slug}`
		).then(data => data.json());

		return { post };
	}
</script>

<script>
	export let post;
	$: {
		console.log(post);
	}
</script>

<div>
	This will be the page for an individual blog post. It'll get the id from the
	title and then render it.
</div>
