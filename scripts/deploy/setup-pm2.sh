#!/bin/bash

# Setup script for PM2 deployment on the Mac mini

echo "Setting up PM2 for barnsworthburning..."

# Create logs directory
mkdir -p logs

# Install and configure pm2-logrotate so log files don't grow unbounded.
# PM2 does NOT rotate logs by default; this module is required.
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Start both the app and auto-deploy monitor
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo ""
echo "PM2 setup complete!"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 status                       - Check status of all processes"
echo "  pm2 logs                         - View all logs"
echo "  pm2 logs barnsworthburning       - View app logs"
echo "  pm2 logs barnsworthburning-deploy - View deployment logs"
echo "  pm2 restart all                  - Restart all processes"
echo "  pm2 stop all                     - Stop all processes"
echo "  pm2 monit                        - Real-time monitoring dashboard"
