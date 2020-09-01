<script>
	export let direction = "down";
	import Icon from './_Base.svelte';

	let rotation;
	switch(direction) {
		case 'left':
			rotation = 90;
			break;
		case 'up':
			rotation = -180;
			break;
		case 'right':
			rotation = -90;
			break;
		case 'down':
		default:
			rotation = 0;
	}
</script>

<Icon transform="rotate({rotation})" {...$$restProps}>
	<path d="M82.5652 160L50.0313 102.607H69.3848V26.6945H20L31.6788 0H145.13L133.452 26.6945H96.0792V102.607H115.099L82.5652 160Z" />
</Icon>
