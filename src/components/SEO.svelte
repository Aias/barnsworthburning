<script>
	import { seo } from '../stores';
</script>

<svelte:head>
	<title>{$seo.title}</title>
	<meta property="og:title" content="{$seo.title}" />
	<meta name="author" content="{$seo.author}" />
	<meta name="description" content="{$seo.description}" />
	<meta property="og:description" content="{$seo.description}" />
	<meta name="keywords" content="{$seo.keywords}" />
	<meta name="theme-color" content="{$seo.themeColor}" />
	<meta
		name="monetization"
		content="$pay.stronghold.co/1a18f752bd394de4172a951e38d6e6bc816"
	/>
</svelte:head>
