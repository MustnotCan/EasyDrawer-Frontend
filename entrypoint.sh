#!/bin/sh

# Create or overwrite config.json with runtime environment variables
cat <<EOF > /usr/share/nginx/html/config.json
{
  "VITE_API_MAIN": "${API:-http://localhost:3001}",
  "VITE_MEILISEARCH_URI":"${MEILISEARCH_URL:-http://localhost:7700}"
}
EOF

# Start nginx or your server
nginx -g 'daemon off;'
