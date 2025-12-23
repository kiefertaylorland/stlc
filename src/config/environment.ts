import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (nodeEnv === 'production') {
    throw new Error(
      'SESSION_SECRET environment variable must be set in production. ' +
      'Refusing to start with an insecure default session secret.'
    );
  } else {
    console.warn(
      "Warning: Using insecure default session secret for non-production environment. " +
      "Set the SESSION_SECRET environment variable to override this."
    );
    sessionSecret = 'default-secret-change-in-production';
  }
}

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv,
  // sessionSecret is defined for future use when session management is implemented
  // Currently not used but included for forward compatibility
  sessionSecret,
  
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
