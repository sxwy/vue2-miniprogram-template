module.exports = {
  extends: ['@sxwy/eslint-config-vue/vue2-typescript'],
  globals: {
    wx: true,
    uni: true,
    UniApp: true,
    WechatMiniprogram: true
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
