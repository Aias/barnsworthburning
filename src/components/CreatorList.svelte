<script lang="ts">
	import { displayTitle, type RecordLink } from '$lib/records';
	import type { HTMLAttributes } from 'svelte/elements';
	import Link from './Link.svelte';

	interface CreatorListProps extends HTMLAttributes<HTMLSpanElement> {
		creators: RecordLink[];
	}

	let { creators, ...restProps }: CreatorListProps = $props();
</script>

<span {...restProps}>
	{#each creators as creator, i (creator.id)}{i > 0
			? i + 1 === creators.length
				? ' & '
				: ', '
			: ''}
		<Link record={creator}>{displayTitle(creator)}</Link>
	{/each}
</span>

<style>
	span {
		color: var(--secondary);
		font-family: var(--font-stack-mono);
	}
</style>
