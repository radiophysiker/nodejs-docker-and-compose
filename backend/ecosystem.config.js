// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.deploy' });
const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/main',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/index.js',
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/radiophysiker/nodejs-docker-and-compose.git',
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current/backend`,
      'post-deploy': 'docker compose down && docker compose up -d --build',
    },
  },
};
