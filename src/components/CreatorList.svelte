<script>
	export let creators = [];
</script>

{#if creators?.length > 0}
	<span {...$$restProps}>
		{#each creators as creator, i (creator.id)}{i > 0 ? (i + 1 === creators.length ? ' & ' : ', ') : ''}
			<a href="/creators/{creator.id}">{creator.name}</a>
		{/each}
	</span>
{/if}
