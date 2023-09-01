module.exports = {
  extends: ['@sxwy/stylelint-config'],
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx']
      }
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page']
      }
    ]
  }
}
