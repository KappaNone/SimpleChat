export const serverUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.APP_PRODUCTION_SERVER_URL

