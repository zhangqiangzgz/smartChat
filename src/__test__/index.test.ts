import stdout from "../utils/stdout"

test('stdout.log', () => {
  expect(stdout.log('111')).toBeUndefined()
})