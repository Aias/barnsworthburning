<script>
	import Fitter from './Fitter.svelte';
</script>

<div class="container">
	<Fitter>
		<div>TEXT</div>
		<div>Really long text</div>
		<div>
			OtherReallyLongTextWhichIsActuallyOneWordAndLongerThanTheReallyLongText
		</div>
	</Fitter>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.container {
		width: 40%;
	}
</style>
