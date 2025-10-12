declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    CONTACT_TO: string;
    CONTACT_FROM: string;
    AUTO_REPLY_ENABLED?: 'true' | 'false';
    NOTION_TOKEN: string;
    NOTION_DB_ID: string;
  }
}