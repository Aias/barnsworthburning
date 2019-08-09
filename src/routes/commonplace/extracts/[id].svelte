<script>
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import { FULL_API } from '../../../config.js';
	import Extract from '../../../components/Extract.svelte';

	const { page } = stores();

	let extract = null;

	onMount(async () => {
		const { id } = $page.params;
		extract = await fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=extracts&id=${id}`
		).then(data => data.json());
	});
</script>

<Extract {extract} />
