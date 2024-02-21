<script lang="ts">
	import Link from './Link.svelte';
	import type { ILinkedRecord } from '$types/Airtable';

	interface CreatorListProps {
		creators: ILinkedRecord[];
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
