const config = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  testEnvironment: 'node'
}

export default config
