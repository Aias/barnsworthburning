<script lang="ts">
	import Link from './Link.svelte';
	import type { ZippedRecord } from '$helpers/mapping';

	interface CreatorListProps {
		creators: ZippedRecord[];
	}

	let { creators, ...restProps } = $props<CreatorListProps>();
</script>

{#if creators}
	<span {...restProps}>
		{#each creators as creator, i (creator.id)}{i > 0
				? i + 1 === creators.length
					? ' & '
					: ', '
				: ''}
			<Link toCreator={creator.id}>{creator.name}</Link>
		{/each}
	</span>
{/if}
