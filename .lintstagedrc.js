module.exports = {
  '!(example|docs)/**/*.{vue,js,jsx,ts,tsx}': 'eslint --fix',
  '!(example|docs)/**/*.{vue,css,less,sass,scss}':
    'stylelint --fix --allow-empty-input'
}
