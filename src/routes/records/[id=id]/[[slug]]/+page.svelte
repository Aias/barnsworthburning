<script lang="ts">
	import RecordItem from '../../../app/RecordItem.svelte';
	import RecordSEO from '../../../app/RecordSEO.svelte';

	let { data } = $props();
</script>

<RecordItem page={data} />
<RecordSEO page={data} />
