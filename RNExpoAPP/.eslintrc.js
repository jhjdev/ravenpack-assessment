module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    // Only analyze TypeScript files
    project: null, // We'll enable this in the overrides section only for .ts/.tsx
    tsconfigRootDir: __dirname,
    LEGACY_CONFIG: true, // Enable legacy config handling
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'react-native/react-native': true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
  ],
  rules: {
    // TypeScript specific rules - more lenient to start
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    
    // React specific rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    
    // React Native specific rules - all warnings for now
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off',
    
    // General rules - more lenient
    'no-console': 'off', // Allow console during development
    'prefer-const': 'warn',
    'no-var': 'warn',
    'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
    'no-empty': 'warn',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },

  // Configuration specifically for TypeScript files
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
      rules: {
        // Stricter rules for TypeScript files can go here
      }
    },
    {
      // Configuration for JavaScript files
      files: ['*.js', '*.jsx'],
      parser: 'espree', // Use the standard parser for JavaScript
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        // Disable TypeScript-specific rules for JS files
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        
        // Use standard ESLint rules instead
        'no-unused-vars': 'warn',
      }
    }
  ]
};

