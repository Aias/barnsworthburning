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
				// Check to see that the element contains text that can actually be resized.
				// This also filters out the <object> element which is automatically appended by svelte to implement width reactivity.
				fitText(childNodes[i]);
			}
		}
	}

	let slowResize = throttle(resize, 100);

	function fitText(node, passes = 0) {
		let computedStyle = window.getComputedStyle(node);
		let fontSize = pxStringToNumeric(computedStyle.fontSize);
		let currentWidth = pxStringToNumeric(computedStyle.width); // More accurate than node.clientWidth;

		let scale = 1 - (currentWidth - w) / currentWidth;
		let delta = Math.abs(1 - scale);

		node.style.fontSize = `${fontSize * scale}px`;

		if (delta < 1 / 1000 || passes >= 5) {
			// Change these numbers to adjust accuracy of the function.
			// Passes is a failsafe to prevent infinite loops.
			return;
		} else {
			fitText(node, passes + 1);
		}
	}

	function pxStringToNumeric(str) {
		return Number(str.substring(0, str.length - 2));
	}

	onMount(() => {
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
