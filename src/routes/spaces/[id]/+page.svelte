<script lang="ts">
	import EntityItem from '../../app/EntityItem.svelte';
	import { capitalize } from '$helpers/grammar.js';

	let { data } = $props();

	let space = $derived(data.space);
	let extracts = $derived(data.extractsInSpace);

	let title = $derived.by(() => {
		const { title, topic } = space;
		let str = capitalize(title || topic);
		// if (icon) str += ` ${icon}`;
		return str;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<EntityItem {title} {extracts} />
