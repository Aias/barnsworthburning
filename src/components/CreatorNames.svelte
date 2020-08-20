<script>
	export let creatorNames = [];
</script>

<span>
	{#each creatorNames as name, i}{i > 0 ? i + 1 === creatorNames.length ? ' & ' : ', ': ''}<span>{name}</span>{/each}
</span>
