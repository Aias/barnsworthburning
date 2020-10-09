<script>
	export let images = [];
	export let imageCaption;

	import markdown from '../helpers/markdown';

	let currentIndex = 0;
	let expanded = false;

	$: totalImages = images.length;
	$: displayedImage = images[currentIndex];

	$: filename = displayedImage.filename;
	$: id = displayedImage.id;
	$: size = displayedImage.size;
	$: type = displayedImage.type;

	let url, width, height;
	$: {
		const thumbnails = displayedImage.thumbnails;
		if (thumbnails && thumbnails.large) {
			url = thumbnails.large.url;
			width = thumbnails.large.width;
			height = thumbnails.large.height;
		} else {
			url = displayedImage.url;
		}
	}

	const getImageUrl = (image, size) => {
		const { thumbnails, url } = image;
		if (!size || !thumbnails) {
			return url;
		} else {
			const thumbnail = thumbnails[size];
			if (thumbnail) {
				return thumbnail.url;
			} else {
				return url;
			}
		}
	};
</script>

<figure class="image-container">
	<div class="main-image">
		{#if totalImages > 1}
		<div class="thumbnails">
			{#each images as image, index (image.id)}
			<div
				class="thumbnail-container"
				class:selected="{index === currentIndex}"
				on:click="{() => currentIndex = index}"
			>
				<img src="{getImageUrl(image, 'large')}" alt="{image.filename}" />
			</div>
			{/each}
		</div>
		{/if}
		<img src="{url}" alt="{filename}" {width} {height} />
	</div>
	{#if imageCaption}
	<figcaption class="caption">{@html markdown.render(imageCaption)}</figcaption>
	{/if}
</figure>

<style>
	.main-image {
		background-color: var(--layer-bg);
		border: 1px solid var(--clr-darker-10);
		position: relative;
		display: inline-block;
	}

	.thumbnails {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 100%;
		padding: 2px;
		background-color: var(--clr-gray-10);
	}

	.thumbnail-container {
		flex: 0 0 auto;
		border: 1px solid rgba(0, 0, 0, 0.25);
		margin: 0 1px;
		transition: all 0.5s;
		cursor: pointer;
		opacity: 0.5;
	}

	.thumbnail-container:hover {
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
		opacity: 1;
	}

	.thumbnail-container.selected {
		border: 1px solid rgba(0, 0, 0, 0.5);
		opacity: 1;
	}

	.thumbnails img {
		height: 2rem;
	}
</style>
