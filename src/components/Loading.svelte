<script>
	import { slide, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let rendered = false;

	const interval = 100; // ms
	const loading = [
		['', '', '', '', 'I', '', ''],
		['', '', '', '', 'I', 'N', ''],
		['', '', '', 'D', 'I', 'N', ''],
		['', '', 'A', 'D', 'I', 'N', ''],
		['', '', 'A', 'D', 'I', 'N', 'G'],
		['', 'O', 'A', 'D', 'I', 'N', 'G'],
		['L', 'O', 'A', 'D', 'I', 'N', 'G']
	].map((row, i) => {
		return row.map((cell, j) => {
			return {
				content: cell,
				delay: (i + 1) * j * interval
			};
		});
	});

	onMount(() => {
		rendered = true;
	});

	const getGridArea = (i, j) => {
		return `grid-area: ${i + 1} / ${j + 1}`;
	};
</script>

{#if rendered}
<div class="loading loading--outer text-mono">
	<div transition:fade class="loading--inner">
		{#each loading as row, i} {#each row as {content, delay}, j}
		<span in:slide="{{delay: delay, duration:  500}}" out:fade>
			{content}
		</span>
		{/each} {/each}
	</div>
</div>
{/if}

<style>
	.loading--outer {
		grid-area: header;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading--inner {
		display: inline-grid;
		grid-template-rows: repeat(7, 1.5rem);
		grid-template-columns: repeat(7, 1.5rem);
		place-items: center;
		padding: 1rem;
		background-color: var(--layer-highlight);
		box-shadow: 0 0 4rem var(--clr-darker-10);
		border: 1px solid var(--divider);
	}
	span {
		display: inline-block;
	}

	@media (max-width: 950px) {
		.loading--outer {
			grid-area: main;
		}
	}
</style>
