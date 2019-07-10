<script>
	import { onMount } from 'svelte';
	import throttle from 'lodash/throttle';
	// import Fitter from './Fitter.svelte';
	let mounted = false;
	let w;
	let fitter;

	$: {
		if (mounted && w) {
			slowResize();
		}
	}

	function resize() {
		let childNodes = fitter.children;
		let numChildren = childNodes.length;
		for (let i = 0; i < numChildren; i++) {
			if (childNodes[i].innerText) {
				fitText(childNodes[i]);
			}
		}
	}

	let slowResize = throttle(resize, 100);

	function fitText(node, targetDelta = 1 / 10000) {
		let fontSize = computedFontSizeToNumeric(
			window.getComputedStyle(node).fontSize
		);
		let currentWidth = node.clientWidth;
		let scale = 1 - (currentWidth - w) / currentWidth;

		if (Math.abs(1 - scale) < targetDelta) {
			return;
		} else {
			node.style.fontSize = `${fontSize * scale}px`;

			fitText(node);
		}
	}

	function computedFontSizeToNumeric(computedFontSize) {
		return Number(
			computedFontSize.substring(0, computedFontSize.length - 2)
		);
	}

	onMount(() => {
		resize();
		mounted = true;
	});
</script>

<div class="container">
	<div class="fitter" bind:clientWidth="{w}" bind:this="{fitter}">
		<div>TEXT</div>
		<div>Really long text</div>
		<div>
			OtherReallyLongTextWhichIsActuallyOneWordAndLongerThanTheReallyLongText
		</div>
	</div>
</div>

<p>
	The width is {w} pixels.
</p>

<style>
	* {
		box-sizing: border-box;
	}

	.container {
		width: 40%;
	}

	.fitter {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.fitter > * {
		display: inline-block;
		white-space: nowrap;
	}
</style>
