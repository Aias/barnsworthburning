<script>
	import Extract from './Extract.svelte';
	let { gallery, meta, class: className } = $props();
</script>

{#if gallery}
	<div class="layout" class={className}>
		{#each gallery as extract (extract.id)}
			<Extract {extract} contextId="gallery" class="card" />
		{/each}
	</div>
{:else}
	<progress />
{/if}

<style lang="scss">
	.layout {
		--gallery-gap: 1rem;

		padding-inline: calc(var(--padding) / 1.5);
		margin-inline: calc(-1 * var(--padding) / 1.5);
		min-width: 35ch;
		column-width: 35ch;
		column-gap: var(--gallery-gap);

		> * {
			margin-bottom: var(--gallery-gap);
		}
	}
</style>
