<script>
	import Link from './Link.svelte';
	const { creators, ...restProps } = $props();
</script>

{#if creators}
	<span {...restProps}>
		{#each creators as creator, i (creator.id)}{i > 0 ? (i + 1 === creators.length ? ' & ' : ', ') : ''}
			<Link toCreator={creator.id}>{creator.name}</Link>
		{/each}
	</span>
{/if}
