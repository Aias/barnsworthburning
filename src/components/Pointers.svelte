<script>
	import range from 'lodash/range';

	export let type = 'right';
	export let count = 0;

	let pointers = {
		right: '›',
		left: '‹',
		space: ' '
	};

	$: arr = range(count);
	$: pointer = pointers[type];
</script>

<span class="pointer">{#each arr as p}{pointer}{/each}</span>

<style>
	.pointer {
		white-space: pre-wrap;
	}
</style>
