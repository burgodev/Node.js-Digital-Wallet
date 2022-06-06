import express from "express";
import routes from "../routes/index.routes";
import cors from "cors";
import helmet from "helmet";
import { errorHandling } from "../middleware/error-handling";
import { default as i18nConfig } from "./i18n";
import { l } from "../helpers/general";

const allowed_origins = (process.env.ALLOWED_ORIGINS || "")?.split("|") || [];

const app = express();

app.use(i18nConfig);

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Feature-Policy, sessionid, responseType, username, userlang, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Cache-Control, Authorization, Refresh, Created"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "authorization, refresh");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; always;");
    res.setHeader("Content-type", "application/json");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "origin-when-cross-origin");
    res.setHeader(
        "Feature-Policy",
        'accelerometer "none"; camera "none"; geolocation "none"; gyroscope "none"; magnetometer "none"; microphone "none"; payment "none"; usb "none";'
    );

    // if (req.method === "OPTIONS") {
    //     res.end("OK");
    // } else {
    //     next();
    // }
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowed_origins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                l.warn("User attempt to access from other cors", { origin });
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

app.use(express.json());
app.use(routes);
app.use(errorHandling);

export default app;
