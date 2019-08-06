<script>
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import markdown from '../../../helpers/markdown';
	import { FULL_API } from '../../../config.js';

	const { page } = stores();

	let extract = null;

	onMount(async () => {
		const { id } = $page.params;
		extract = await fetch(
			`${FULL_API}/record?table=extracts&id=${id}`
		).then(data => data.json());
	});
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
