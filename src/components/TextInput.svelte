<script lang="ts">
	import metadata, { ViewportContent } from '$lib/metadata.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	interface TextInputProps extends HTMLInputAttributes {
		type: 'text' | 'search';
		inline?: boolean;
	}

	let { type, inline = false, value = $bindable(), ...restProps }: TextInputProps = $props();

	function preventZoomOnFocus() {
		metadata.setViewport(ViewportContent.NoSafariZoom);
	}
	function allowZoomOnBlur() {
		metadata.setViewport(ViewportContent.Default);
	}
</script>

<input
	class:inline
	{type}
	bind:value
	onfocus={preventZoomOnFocus}
	onblur={allowZoomOnBlur}
	{...restProps}
/>
