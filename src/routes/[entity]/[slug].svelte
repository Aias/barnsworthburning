<script context="module">
	import select from '../../helpers/select';

	export async function preload({ params, query }) {
		const { entity, slug } = params;
		let creator, space;

		switch (entity) {
			case 'creator':
				creator = await select('creators', {
					filterByFormula: `slug = "${slug}"`
				})(this.fetch);
				if (creator.length > 0) creator = creator[0];
				break;
			case 'space':
				space = await select('spaces', {
					filterByFormula: `topic = "${slug}"`
				})(this.fetch);
				if (space.length > 0) space = space[0];
				break;
			default:
				console.error('Unknown entity!');
		}

		const extractsArr = creator ? creator.extracts : space.extracts;
		const extractIds = extractsArr.join(',');

		const extracts = await select('extracts', {
			filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`
		})(this.fetch);

		return {
			entity,
			creator,
			space,
			extracts
		};
	}
</script>

<script>
	import Extract from '../../components/Extract.svelte'
	
	export let entity;
	export let creator;
	export let space;
	export let extracts;

	$: {
		console.log(creator || space);
	}
</script>

<div class="wrapper">
	<a href="/">Close Panel</a>
	<div class="extract-list">
		{#each extracts as extract (extract.full_slug)}
			<Extract {extract} suppressCitation="{entity === 'creator'}" />
		{/each}		
	</div>
</div>

<style>
	.wrapper {
		width: 500px;
	}
	
	.extract-list {
		margin-top: 2rem;
	}

	.extract-list :global(.extract + .extract) {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--divider);
	}	
</style>
