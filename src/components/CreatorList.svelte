<script>
	let { creators, ...restProps } = $props();
</script>

{#if creators}
	<span {...restProps}>
		{#each creators as creator, i (creator.id)}{i > 0 ? (i + 1 === creators.length ? ' & ' : ', ') : ''}
			<a href="?creator={creator.id}">{creator.name}</a>
		{/each}
	</span>
{/if}
