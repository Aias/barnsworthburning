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

	// Create a string of star emojis given a count
	function starRating(count) {
		return '⭐️'.repeat(count);
	}
</script>


{#snippet extractCard({title, extract, images, michelinStars, notes})}
<article>
	<h3>
		{#if michelinStars}
		<span>{starRating(michelinStars)}</span>
		{/if}
		<span>{title}</span>
	</h3>
	{#if images}
		{#each images as image}
			<AirtableImage image={image} />
		{/each}
	{/if}
	{#if extract}
		<p>{trimString(extract, previewLength)}</p>
	{/if}
	{#if notes}
	<small>{trimString(notes, previewLength)}</small>
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
		--gallery-gap: 0.25em;
		font-size: 0.5em;
		column-width: 15em;
		column-gap: var(--gallery-gap);
	}
	article {
		--extract-gap: 1em;
		border: 1px solid var(--divider);
		padding: 1em;
		margin-bottom: var(--gallery-gap);
		display: flex;
		flex-direction: column;
		gap: var(--extract-gap);
		break-inside: avoid;
		word-wrap: break-word;

		p, small {
			font-weight: 300;
		}

		small {
			color: var(--secondary);
			border-top: 1px solid var(--divider);
			padding-top: var(--extract-gap);
		}
	}
</style>
