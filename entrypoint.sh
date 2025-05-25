#!/bin/sh

# Create or overwrite config.json with runtime environment variables
cat <<EOF > /usr/share/nginx/html/config.json
{
  "VITE_API_MAIN": "${VITE_API_MAIN:-http://localhost:3001}"
}
EOF

# Start nginx or your server
nginx -g 'daemon off;'
