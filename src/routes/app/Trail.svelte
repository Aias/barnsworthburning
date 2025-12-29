<script lang="ts">
	import trail from '$lib/trail.svelte';
	import { classnames } from '$helpers/classnames';
	import TrailSegment from './TrailSegment.svelte';

	let { ...restProps } = $props();
</script>

<ol class:trail={true} {...restProps}>
	{#each trail.segments as segment, index (`${segment.entityId}-${index}`)}
		<li class={classnames('segment', 'chromatic', segment.color)}>
			<div class="segment-separator" role="presentation" aria-hidden="true"></div>
			<div class="segment-contents">
				<TrailSegment {segment} />
			</div>
		</li>
	{/each}
</ol>

<style>
	.trail {
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.segment {
		flex: 0 0 auto;
		width: var(--segment-width);
		height: 100%;
		display: flex;
		flex-direction: row;
		background-color: var(--background);
	}

	.segment-contents,
	.segment-separator {
		height: 100%;
	}

	.segment-contents {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
	}

	.segment-separator {
		position: sticky;
		inset-inline-start: 0;
		inset-block: 0;
		border-inline-end: 1px solid var(--edge);
		border-block: none;
		padding: 0;
		margin: 0;
		width: 0;
		z-index: 1;
	}
</style>
