<script>
	export let reverse = false;
</script>

<svg
	viewBox="0 0 160 160"
	xmlns="http://www.w3.org/2000/svg"
	class:reverse="{reverse}"
>
	<rect
		x="0"
		y="80"
		width="50"
		height="50"
		transform="rotate(-45 0 80)"
		style="animation-delay: 0.5s;"
	/>
	<rect
		x="45"
		y="35"
		width="50"
		height="50"
		transform="rotate(-45 45 35)"
		style="animation-delay: 0;"
	/>
	<rect
		x="90"
		y="80"
		width="50"
		height="50"
		transform="rotate(-45 90 80)"
		style="animation-delay: 1s;"
	/>
	<rect
		x="45"
		y="125"
		width="50"
		height="50"
		transform="rotate(-45 45 125)"
		style="animation-delay: 1.5s;"
	/>
</svg>

<style>
	@keyframes flicker {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	svg {
		--size: 1rem;
		width: var(--size);
		height: var(--size);
	}

	rect {
		fill: var(--text-primary);
		animation: flicker 2s infinite;
		animation-timing-function: ease-in;
		animation-fill-mode: both;
		animation-direction: alternate;
	}

	.reverse > rect {
		animation-direction: alternate-reverse;
	}
</style>
