import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  let base = '/'
  if (mode === 'production' && process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    if (repoName && !repoName.endsWith('.github.io')) {
      base = `/${repoName}/`
    }
  }

  return {
    base,
    plugins: [react()],
  }
})
