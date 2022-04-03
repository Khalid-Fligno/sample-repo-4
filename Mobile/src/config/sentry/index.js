import * as Sentry from "@sentry/react-native";

const regEx = ["localhost", /^\//, /^https:\/\//]
const dsn = "https://12437c0b082140d5af62eff3a442ecd8@o1160693.ingest.sentry.io/6245334"
const routingInstrumentation = new Sentry.ReactNavigationV4Instrumentation();

export const sentryConfig = {
    dsn: dsn,
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation,
            tracingOrigins: regEx,
        }),
    ],
    tracesSampleRate: 0.2,
    enableNative: true,
    debug: true,
}