<script lang="ts">
	import trail from '$lib/trail.svelte';
	import { classnames } from '$helpers/classnames';
	import TrailSegment from './TrailSegment.svelte';

	let { ...restProps } = $props();
</script>

<ol class:trail={true} {...restProps}>
	{#each trail.segments as { entityId, entityType, color, addedOn } (addedOn)}
		<li class={classnames('segment', 'chromatic', color)}>
			<hr class="segment-separator" />
			<div class="segment-contents">
				<TrailSegment {entityId} {entityType} />
			</div>
		</li>
	{/each}
</ol>

<style lang="scss">
	.trail {
		height: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		flex: 1 0 auto;

		> .segment {
			display: contents;
		}
	}

	.segment-separator,
	.segment-contents {
		flex: 0 1 100%;
	}

	.segment-contents {
		background-color: var(--background);
		padding: 1rem;
		width: var(--segment-width);
		overflow-y: auto;
	}

	.segment-separator {
		border-inline-end: 1px solid var(--edge);
		inset-inline-start: 1px;
		width: 1px;
		z-index: 100;
	}
</style>
