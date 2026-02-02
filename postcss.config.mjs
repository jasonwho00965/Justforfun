/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 关键点：这里要改成新的包名
    '@tailwindcss/postcss': {},
  },
};

export default config;