<script>
	export let creatorNames = [];

	import slugify from '../helpers/slugify';
</script>

<span {...$$restProps}>
	{#each creatorNames as name, i}{i > 0 ? i + 1 === creatorNames.length ? ' & ' : ', ': ''}<a
		href="/creators/{slugify(name)}"
		>{name}</a
	>{/each}
</span>
