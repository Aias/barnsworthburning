<script>
	export let creatorNames = [];

	import InternalLink from './InternalLink.svelte';
	import slugify from '$helpers/slugify';
</script>

<span {...$$restProps}>
	{#each creatorNames as name, i}{i > 0 ? i + 1 === creatorNames.length ? ' & ' : ', ': ''}<InternalLink
		toType="creators"
		toEntity="{slugify(name)}"
		>{name}</InternalLink
	>{/each}
</span>
