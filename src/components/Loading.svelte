<script>
	import { derived } from 'svelte/store';
	import { navigating } from '$app/stores';
	import { loading } from '../stores';

	const loadingAll = derived([navigating, loading], ([$navigating, $loading]) => {
		if ($navigating) {
			return true;
		} else {
			return $loading;
		}
	});
</script>

{#if $loadingAll}
<div class="loading-indicator">
	<progress></progress>
</div>
{/if}

<style>
	.loading-indicator {
		display: block;
		position: fixed;
		height: 0.25rem;
		background-color: var(--theme-primary);
		top: 0;
		animation-name: bounce;
		animation-play-state: running;
		animation-iteration-count: infinite;
		animation-duration: 4s;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
	}
	.loading-indicator > progress {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: none;
		display: block;
		width: 100%;
		height: 0;
		opacity: 0;
		visibility: hidden;
	}

	@keyframes bounce {
		0% {
			width: 0;
			left: 0;
		}
		50% {
			width: 100%;
			left: 0;
		}
		100% {
			width: 0;
			left: 100%;
		}
	}
</style>
