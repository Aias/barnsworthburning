<svelte:options runes={true} />

<script>
	import { getContext, setContext } from 'svelte';
	let { mode, palette, chroma } = $props();
	
	let contextMode = getContext('mode');
	let contextPalette = getContext('palette');
	let contextChroma = getContext('chroma');

	console.log(contextMode, contextPalette, contextChroma);

	let localMode = mode || contextMode;
	let localPalette = palette || contextPalette;
	let localChroma = chroma || contextChroma;

	setContext('mode', localMode);
	setContext('palette', localPalette);
	setContext('chroma', localChroma);
</script>

<div class={`${localMode} ${localPalette} ${localChroma}`}>
	<slot></slot>
</div>

<style>
	div {
		display: contents;
	}
</style>