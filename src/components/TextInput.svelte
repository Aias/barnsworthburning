<script lang="ts">
	import meta, { ViewportContent } from '$lib/meta.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	interface TextInputProps extends HTMLInputAttributes {
		type: 'text' | 'search';
		inline?: boolean;
	}

	let { type, inline = false, value = $bindable(), ...restProps }: TextInputProps = $props();

	function preventZoomOnFocus() {
		meta.setViewport(ViewportContent.NoSafariZoom);
	}
	function allowZoomOnBlur() {
		meta.setViewport(ViewportContent.Default);
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
