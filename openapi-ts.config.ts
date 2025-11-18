import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi-local.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/client',
  },
  parser: {
    filters: {
      tags: { exclude: ['Dev'] },
      // schemas: {
      //   include: [],
      //   exclude: []
      // },
      // parameters: {
      //   include: ['QueryParameter', '/^MyQueryParameter/'],
      //   exclude: []
      // },
      // requestBodies: {
      //   include: ['Payload', '/^SpecialPayload/'],
      //   exclude: []
      // },
      // responses: {
      //   include: ['Foo', '/^Bar/'],
      //   exclude: []
      // },
    },
  },

  plugins: [
    // Plugins base
    //'@hey-api/schemas',
    '@hey-api/sdk',
    // '@hey-api/transformers',
    '@hey-api/typescript',
    '@hey-api/client-axios',
    // Plugins extra
    // '@tanstack/react-query',
    'zod',
    // Plugins com configuração como objetos
    // {
    //   name: '@hey-api/transformers',
    //   dates: true,
    //   bigInt: true,
    //   exportFromIndex: false,
    // },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    // {
    //   name: '@hey-api/client-axios',
    //   baseUrl: process.env.NEXT_PUBLIC_API_URL,
    // },
    // {
    //   name: '@hey-api/sdk',
    //   transformer: true,
    // },
  ],
})
