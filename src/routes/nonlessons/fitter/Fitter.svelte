<script>
	import { onMount } from 'svelte';
	import throttle from 'lodash/throttle';

	export let targetDelta = 1 / 1000;
	export let maxPasses = 5;
	export let throttleSpeed = 100;

	let w = undefined;
	let fitter = undefined;

	$: {
		if (w) {
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

	let slowResize = throttle(resize, throttleSpeed);

	function fitText(node, passes = 0) {
		let computedStyle = window.getComputedStyle(node);
		let fontSize = pxStringToNumeric(computedStyle.fontSize);
		let currentWidth = pxStringToNumeric(computedStyle.width); // More accurate than node.clientWidth;

		let scale = 1 - (currentWidth - w) / currentWidth;
		let delta = Math.abs(1 - scale);

		node.style.fontSize = `${fontSize * scale}px`;

		if (delta < targetDelta || passes >= maxPasses) {
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
</script>

<div class="fitter" bind:clientWidth="{w}" bind:this="{fitter}">
	<slot> </slot>
</div>

<style>
	.fitter {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.fitter > :global(*) {
		display: inline-block;
		white-space: nowrap;
	}
</style>
