<script lang="ts">
	import Link from './Link.svelte';
	import type { ILinkedRecord } from '$types/Airtable';
	import type { HTMLAttributes } from 'svelte/elements';

	interface CreatorListProps extends HTMLAttributes<HTMLSpanElement> {
		creators: ILinkedRecord[];
	}

	let { creators, ...restProps }: CreatorListProps = $props();
</script>

<span {...restProps}>
	{#each creators as creator, i (creator.id)}{i > 0
			? i + 1 === creators.length
				? ' & '
				: ', '
			: ''}
		<Link toType="creator" toId={creator.id}>{creator.name}</Link>
	{/each}
</span>

<style>
	span {
		color: var(--secondary);
		font-family: var(--font-stack-mono);
	}
</style>
