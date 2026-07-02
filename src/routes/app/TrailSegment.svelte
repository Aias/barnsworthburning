<script lang="ts">
	import { setContext } from 'svelte';
	import { parse } from 'devalue';
	import RecordItem from './RecordItem.svelte';
	import type { RecordPage } from '$lib/records';
	import type { TrailSegment } from '$lib/trail.svelte';

	interface TrailSegmentProps {
		segment: TrailSegment;
	}
	let { segment }: TrailSegmentProps = $props();

	let recordPage = $state<RecordPage>();

	setContext('trailSegment', () => segment);

	$effect(() => {
		const { entityId } = segment;
		let cancelled = false;
		void (async () => {
			const response = await fetch(`/records/${entityId}/context.json`);
			if (!response.ok || cancelled) return;
			const parsed: RecordPage = parse(await response.text());
			if (!cancelled) {
				recordPage = parsed;
			}
		})();
		return () => {
			cancelled = true;
		};
	});
</script>

{#if recordPage}
	<RecordItem page={recordPage} />
{:else}
	<div class="loading-container">
		<p><em>Loading...</em></p>
		<div class="loader"></div>
	</div>
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
	}
	p {
		color: var(--accent);
	}
	/* https://css-loaders.com/progress/ */
	.loader {
		height: 0.25rem;
		width: 100%;
		border-radius: var(--border-radius-small);
		--c: no-repeat linear-gradient(var(--main) 0 0);
		background: var(--c), var(--c), var(--sink);
		background-size: 60% 100%;
		animation: l16 3s infinite;
	}
	@keyframes l16 {
		0% {
			background-position:
				-150% 0,
				-150% 0;
		}
		66% {
			background-position:
				250% 0,
				-150% 0;
		}
		100% {
			background-position:
				250% 0,
				250% 0;
		}
	}
</style>
