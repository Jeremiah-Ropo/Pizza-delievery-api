declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    PG_HOST: string;
    PG_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    USER_JWT_SECRET: string;
    STAFF_JWT_SECRET: string;
    API_SECRET: string;
    API_KEY: string;
    CLOUD_NAME: string;
    PAYSTACK_SECRET_KEY: string;
    QPAYSECRET: string;
    LIVE_KEY: string;
  }
}
