/* eslint-disable no-undef */

const { AntdResisableSider } = require('../index.tsx')
// eslint-disable-next-line no-use-before-define
const React = require('react')

test('this is a test', () => {
  expect(<AntdResisableSider/>).toBeInstanceOf(React.Component)
})
