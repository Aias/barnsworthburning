import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		files: ['**/*.{ts,js,svelte}'],
		rules: {
			'no-undef': 'off',
			'svelte/no-at-html-tags': 'off',
			// Trail navigation builds URLs from SvelteKit's own page.url/to.url,
			// which are already base-resolved; resolve() only takes route IDs.
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/prefer-writable-derived': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},
	{
		ignores: [
			'.claude/**',
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'.DS_Store',
			'/package',
			'.env',
			'.env.*',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'src/lib/*.svelte.ts'
		]
	}
);
