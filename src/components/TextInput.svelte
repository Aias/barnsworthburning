<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	interface TextInputProps extends HTMLInputAttributes {
		type: 'text' | 'search';
		inline?: boolean;
	}

	let { type, inline = false, value = $bindable(), ...restProps }: TextInputProps = $props();
</script>

<input class:inline {type} bind:value {...restProps} />
