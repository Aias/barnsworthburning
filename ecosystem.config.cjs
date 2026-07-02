module.exports = {
	apps: [
		{
			// Main application (adapter-node build output)
			name: 'barnsworthburning',
			script: 'node',
			args: '--env-file=.env build',
			cwd: __dirname,
			env: {
				NODE_ENV: 'production',
				PORT: 3002
			},
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			error_file: './logs/errors.log',
			out_file: './logs/output.log',
			log_file: './logs/combined.log',
			merge_logs: true,
			time: true,
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
		},
		{
			// Auto-deployment monitor
			name: 'barnsworthburning-deploy',
			script: './scripts/deploy/auto-deploy.sh',
			cwd: __dirname,
			interpreter: '/bin/bash',
			autorestart: true,
			watch: false,
			error_file: './logs/deploy-error.log',
			out_file: './logs/deploy-out.log',
			log_file: './logs/deploy-combined.log',
			time: true,
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
		}
	]
};
