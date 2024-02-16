<script lang="ts">
	import Extract from './Extract.svelte';
	import type { IExtract } from '$types/Extract';

	interface GalleryProps {
		gallery: IExtract[];
		meta: any;
		componentClass: string;
	}

	let { gallery, meta, componentClass } = $props<GalleryProps>();
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
	<progress />
{/if}

<style lang="scss">
	.gallery {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 1rem;
		margin: 0 -1rem;
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

		column-width: 35ch;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-bottom: var(--gallery-gap);
		}
	}
</style>
