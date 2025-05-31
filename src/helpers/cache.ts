/**
 * Cache control header configurations for different types of content
 */

interface CacheConfig {
	/**
	 * Browser cache duration in seconds
	 */
	maxAge?: number;
	/**
	 * CDN cache duration in seconds
	 */
	sMaxAge?: number;
	/**
	 * Allow serving stale content while revalidating in background
	 */
	staleWhileRevalidate?: number;
	/**
	 * Cache can be stored by shared caches (CDN)
	 */
	public?: boolean;
}

const CACHE_CONFIGS = {
	// For entity lists that change occasionally
	entityList: {
		maxAge: 60, // 1 minute browser cache
		sMaxAge: 300, // 5 minutes CDN cache
		staleWhileRevalidate: 86400, // 1 day stale-while-revalidate
		public: true
	},
	// For individual entities that change rarely
	entity: {
		maxAge: 300, // 5 minutes browser cache
		sMaxAge: 3600, // 1 hour CDN cache
		staleWhileRevalidate: 604800, // 1 week stale-while-revalidate
		public: true
	},
	// For search results that are dynamic
	search: {
		maxAge: 0, // No browser cache
		sMaxAge: 60, // 1 minute CDN cache
		staleWhileRevalidate: 300, // 5 minutes stale-while-revalidate
		public: true
	},
	// For feed that updates regularly
	feed: {
		maxAge: 0, // No browser cache
		sMaxAge: 300, // 5 minutes CDN cache
		public: true
	}
} as const;

/**
 * Generate cache control header string from config
 */
function generateCacheControl(config: CacheConfig): string {
	const parts: string[] = [];

	if (config.public) {
		parts.push('public');
	}

	if (config.maxAge !== undefined) {
		parts.push(`max-age=${config.maxAge}`);
	}

	if (config.sMaxAge !== undefined) {
		parts.push(`s-maxage=${config.sMaxAge}`);
	}

	if (config.staleWhileRevalidate !== undefined) {
		parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
	}

	return parts.join(', ');
}

/**
 * Get cache headers for a specific cache type
 */
export function getCacheHeaders(type: keyof typeof CACHE_CONFIGS): HeadersInit {
	const config = CACHE_CONFIGS[type];
	return {
		'Cache-Control': generateCacheControl(config),
		Vary: 'Accept-Encoding'
	};
}

/**
 * Create a cached JSON response
 */
export function cachedJson<T>(data: T, cacheType: keyof typeof CACHE_CONFIGS = 'entity'): Response {
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			...getCacheHeaders(cacheType)
		}
	});
}
