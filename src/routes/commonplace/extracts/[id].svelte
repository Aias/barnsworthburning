<script context="module">
	import { FULL_API } from '../../../config.js';

	export async function preload(page, session) {
		const { id } = page.params;
		const extract = await this.fetch(
			`${FULL_API}/record?table=extracts&id=${id}`
		).then(data => data.json());

		return { extract };
	}
</script>

<script>
	import markdown from '../../../helpers/markdown';

	export let extract = {};
</script>

{#if extract}
<article>
	<h1>{extract.title}</h1>
	<blockquote>
		{@html markdown.render(extract['extract_text'])}
		<cite
			>—&nbsp;{extract['creator_name'][0]},
			{extract['group_name'][0]}</cite
		>
	</blockquote>
	<footer>
		Recorded on {new Date(extract['extracted_on'])}
	</footer>
</article>
{/if}

<style>
	article {
		max-width: 50rem;
	}
	blockquote {
		margin: 0;
	}
	footer {
		margin-top: 2rem;
		font-size: 0.8em;
	}
</style>
