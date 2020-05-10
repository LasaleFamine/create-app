/*
  eslint-disable
  @typescript-eslint/no-var-requires,
  no-param-reassign,
  global-require
*/

const {
  PHASE_DEVELOPMENT_SERVER,
} = require('next/constants');

module.exports = (phase) => {
  // Started in development mode `yarn dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER || process.env.NODE_ENV === 'development';

  const env = {
    IS_DEV: isDev,
  };

  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  return withBundleAnalyzer({
    env,
  });
};
