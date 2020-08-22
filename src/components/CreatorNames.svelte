<script>
	export let creatorNames = [];

	import Link from './Link.svelte';
	import slugify from '../helpers/slugify';
</script>

<span>
	{#each creatorNames as name, i}{i > 0 ? i + 1 === creatorNames.length ? ' & ' : ', ': ''}<Link href="/creator/{slugify(name)}">{name}</Link>{/each}
</span>
