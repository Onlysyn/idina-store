import { defineCliConfig } from 'sanity/cli'

const projectId = 'kwzovmjy'

export default defineCliConfig({
  api: {
    projectId,
    dataset: 'production',
  },
})
