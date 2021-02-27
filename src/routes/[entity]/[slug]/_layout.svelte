<script>
	import ExtractGallery from '../../../components/ExtractGallery.svelte';

	export let segment;
</script>

<div class="layout__gallery" class:segment="{segment}">
	<ExtractGallery />
</div>
<div class="layout__panel"><slot /></div>