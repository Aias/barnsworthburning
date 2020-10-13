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
	<meta name="monetization" content="$ilp.uphold.com/AqdQQ2khBpyN" />
</svelte:head>
