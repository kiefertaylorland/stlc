import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  
  // OAuth configurations (to be populated when API tokens are available)
  oauth: {
    testRail: {
      clientId: process.env.TESTRAIL_CLIENT_ID,
      clientSecret: process.env.TESTRAIL_CLIENT_SECRET
    },
    jira: {
      clientId: process.env.JIRA_CLIENT_ID,
      clientSecret: process.env.JIRA_CLIENT_SECRET
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    figma: {
      clientId: process.env.FIGMA_CLIENT_ID,
      clientSecret: process.env.FIGMA_CLIENT_SECRET
    },
    notion: {
      clientId: process.env.NOTION_CLIENT_ID,
      clientSecret: process.env.NOTION_CLIENT_SECRET
    }
  },
  
  // LLM configuration
  llm: {
    endpoint: process.env.LLM_ENDPOINT,
    model: process.env.LLM_MODEL
  }
};
