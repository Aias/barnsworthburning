interface CacheConfig {
	maxAge?: number;
	sMaxAge?: number;
	staleWhileRevalidate?: number;
	public?: boolean;
}

const CACHE_CONFIGS = {
	entityList: {
		maxAge: 60, // 1 min
		sMaxAge: 300, // 5 min
		staleWhileRevalidate: 86400, // 1 day
		public: true
	},
	entity: {
		maxAge: 300, // 5 min
		sMaxAge: 3600, // 1 hr
		staleWhileRevalidate: 604800, // 1 week
		public: true
	},
	search: {
		maxAge: 0,
		sMaxAge: 60, // 1 min
		staleWhileRevalidate: 300, // 5 min
		public: true
	},
	feed: {
		maxAge: 0,
		sMaxAge: 300, // 5 min
		public: true
	}
} as const;

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

export function getCacheHeaders(type: keyof typeof CACHE_CONFIGS): HeadersInit {
	const config = CACHE_CONFIGS[type];
	return {
		'Cache-Control': generateCacheControl(config),
		Vary: 'Accept-Encoding'
	};
}

export function cachedJson<T>(data: T, cacheType: keyof typeof CACHE_CONFIGS = 'entity'): Response {
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			...getCacheHeaders(cacheType)
		}
	});
}
