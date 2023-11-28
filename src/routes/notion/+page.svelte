<script>
	import '$styles/app.css';

	export let data;

	const schema = {
		title: {
			name: 'Title',
			type: 'title'
		},
		url: {
			name: 'URL',
			type: 'url'
		}
	};

	$: extracts = (data?.extracts || []).map((extract) => {
		const properties = extract.properties;

		const title = properties['Title'].title?.[0]?.plain_text;
		const url = properties['URL'].url;
		const domain = url && new URL(url).hostname;

		return { title, url, domain };
	});

	console.log(data);
</script>

<div>
	{#each extracts as extract}
		<section>
			<h3>{extract.title}</h3>
			{#if extract.url}
				<a href={extract.url}>{extract.domain}</a>
			{/if}
		</section>
	{/each}
</div>

<style lang="scss">
	div {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1rem;
		justify-content: center;
		padding: 1rem;
	}
	section {
		background-color: var(--paper);
		border-radius: 2px;
		border: 1px solid var(--divider);
		padding: 1rem;
	}
	a {
		max-width: 100%;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		text-wrap: nowrap;
	}
</style>
