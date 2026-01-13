module.exports = {
  apps: [
    {
      name: 'bench-frontend',
      script: './node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/root/Bench-List/frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://139.59.75.176:8000',
        API_URL: 'http://139.59.75.176:8000',
        HOSTNAME: '0.0.0.0'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:8000',
        API_URL: 'http://localhost:8000',
        HOSTNAME: '0.0.0.0'
      },
      error_file: '/root/logs/bench-frontend-error.log',
      out_file: '/root/logs/bench-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};
