<script>
	import Fitter from '../../../components/Fitter.svelte';
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
		width: 50%;
		margin: 0 auto;
	}
</style>
