<script lang="ts">
	import Extract from './Extract.svelte';
	import type { IExtract } from '$types/Airtable';

	interface GalleryProps {
		gallery: IExtract[];
		meta: any;
		componentClass: string;
	}

	let { gallery, meta, componentClass }: GalleryProps = $props();
</script>

{#if gallery}
	<div class={componentClass} class:gallery>
		<header class="gallery-meta">
			{#if meta?.type === 'creator'}
				<h1>{meta.creator.name}</h1>
			{:else if meta?.type === 'space'}
				<h1>{meta.space.topic}</h1>
			{/if}
		</header>
		<div class="gallery-grid">
			{#each gallery as extract (extract.id)}
				<Extract {extract} contextId="gallery" componentClass="card" />
			{/each}
		</div>
	</div>
{:else}
	<progress></progress>
{/if}

<style lang="scss">
	.gallery {
		--gutter: 1em;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-block: 0;
		padding-inline: var(--gutter);
		margin-block: 0;
		margin-inline: calc(-1 * var(--gutter));
	}
	.gallery-meta {
		h1 {
			text-transform: capitalize;
		}
	}
	.gallery-grid {
		--gallery-gap: 1em;

		padding-inline: calc(var(--padding) / 1.5);
		margin-inline: calc(-1 * var(--padding) / 1.5);

		column-width: 35ch;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-block-end: var(--gallery-gap);
		}
	}
</style>
