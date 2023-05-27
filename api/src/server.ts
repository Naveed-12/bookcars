import express, {Express} from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import compression from 'compression'
import helmet from 'helmet'
import nocache from 'nocache'
import strings from './config/app.config'
import userRoutes from './routes/userRoutes'
import carRoutes from './routes/carRoutes'
import notificationRoutes from './routes/notificationRoutes'
import companyRoutes from './routes/companyRoutes'
import locationRoutes from './routes/locationRoutes'
import bookingRoutes from './routes/bookingRoutes'
import {versionController} from "./controllers/versionController";

const DB_SSL = process.env.BC_DB_SSL.toLowerCase() === 'true'
const DB_SSL_KEY = process.env.BC_DB_SSL_KEY
const DB_SSL_CERT = process.env.BC_DB_SSL_CERT
const DB_SSL_CA = process.env.BC_DB_SSL_CA
const DB_DEBUG = process.env.BC_DB_DEBUG.toLowerCase() === 'true'
const DB_URI = process.env.BC_DB_URI;

let options = {}
if (DB_SSL) {
    options = {
        ssl: true,
        sslValidate: true,
        sslKey: DB_SSL_KEY,
        sslCert: DB_SSL_CERT,
        sslCA: [DB_SSL_CA]
    }
}

mongoose.set('debug', DB_DEBUG)
mongoose.Promise = global.Promise
mongoose.connect(DB_URI, options)
    .then(
        () => { console.log('Database is connected') },
        (err: unknown) => { console.error('Cannot connect to the database:', err) }
    )
export function getExpres():Express {
    const app = express()
    app.use(helmet.contentSecurityPolicy())
    app.use(helmet.dnsPrefetchControl())
    app.use(helmet.crossOriginEmbedderPolicy())
    app.use(helmet.frameguard())
    app.use(helmet.hidePoweredBy())
    app.use(helmet.hsts())
    app.use(helmet.ieNoOpen())
    app.use(helmet.noSniff())
    app.use(helmet.permittedCrossDomainPolicies())
    app.use(helmet.referrerPolicy())
    app.use(helmet.xssFilter())
    app.use(helmet.originAgentCluster())
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
// app.use(
//     helmet({
//         xPermittedCrossDomainPolicies: false,
//     })
// );
// app.use(
//     helmet({
//         crossOriginResourcePolicy: false,
//     })
// );
// // Sets "Cross-Origin-Embedder-Policy: credentialless"
// app.use(helmet({ crossOriginEmbedderPolicy: { policy: "credentialless" } }));
    app.use(helmet.crossOriginOpenerPolicy())
    app.use(nocache())
    app.use(compression({ threshold: 0 }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))
    app.use(express.json({ limit: '50mb' }))
    app.use(cors())
    app.use('/', userRoutes)
    app.use('/', companyRoutes)
    app.use('/', locationRoutes)
    app.use('/', carRoutes)
    app.use('/', bookingRoutes)
    app.use('/', notificationRoutes)

    app.get('/', versionController)

    strings.setLanguage(process.env.BC_DEFAULT_LANGUAGE)

    return app;
}