<script>
	import { page } from '$app/stores';
	import AirtableImage from '../../../components/AirtableImage.svelte';

	let trail = $derived($page.params.trail.split('/'));
	let data = $derived($page.data);

	let screens = $derived(trail.map((id) => data[id]));

	const previewLength = 280;

	// Function to trim a string to a certain length
	function trimString(string, length) {
		if (!string) return;
		if (string.length > length) {
			return string.substring(0, length) + '...';
		} else {
			return string;
		}
	}

	$inspect(screens[0]);
</script>


{#snippet extractCard({title, extract, images})}
<article>
	<h3>{title}</h3>
	{#if images}
		{#each images as image}
			<AirtableImage image={image} />
		{/each}
	{/if}
	{#if extract}
		<p>{trimString(extract, previewLength)}</p>
	{/if}
</article>
{/snippet}

{#each trail as step, i (step)}
	<section>
		<h2>{step}</h2>
		<div class="looseleaf">
			{#each screens[i] as extract}
				{@render extractCard(extract)}
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	section {
		flex: 0 0 480px;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.looseleaf {
		--gap: 0.25em;
		font-size: 0.5em;
		column-width: 15em;
		column-gap: var(--gap);
	}
	article {
		border: 1px solid var(--divider);
		padding: 1em;
		margin-bottom: var(--gap);
		display: flex;
		flex-direction: column;
		gap: 1em;
		break-inside: avoid;
	}
</style>
