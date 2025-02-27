import globals from 'globals'
import js from '@eslint/js'
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
]
