<script>
	import Extract from './Extract.svelte';
	const { gallery, meta, componentClass } = $props();
</script>

{#if gallery}
	<div class={componentClass} class:gallery>
		<header class="gallery-meta">
			{#snippet creatorMeta({ name, profession, organization, site, nationality })}
			<h1>{name}</h1>
			{/snippet}

			{#snippet spaceMeta({ topic, icon, title, description })}
			<h1>{topic}</h1>
			{/snippet}

			{#if meta?.type === 'creator'}
			{@render creatorMeta(meta.creator)}
			{:else if meta?.type === 'space'}
			{@render spaceMeta(meta.space)}
			{/if}
		</header>
		<div class="gallery-grid">
			{#each gallery as extract (extract.id)}
				<Extract {extract} contextId="gallery" componentClass="card" />
			{/each}
		</div>	
	</div>
{:else}
	<progress />
{/if}

<style lang="scss">
	.gallery {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.gallery-meta {
		h1 {
			text-transform: capitalize;
		}
	}
	.gallery-grid {
		--gallery-gap: 1rem;

		padding-inline: calc(var(--padding) / 1.5);
		margin-inline: calc(-1 * var(--padding) / 1.5);
		min-width: 35ch;
		column-width: 35ch;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-bottom: var(--gallery-gap);
		}
	}
</style>
