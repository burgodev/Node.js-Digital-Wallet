import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';

i18next
    .use(Backend)
    .init({
        lng: 'en',
        backend: {
            loadPath: __dirname + '/../i18n/{{lng}}.json'
        },
        debug: process.env.DEBUG_I18N == 'true' || false,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        preload: ['en', 'pt', 'es', 'it'],
        saveMissing: true,
        fallbackLng: ['en']
    });

export default i18nextMiddleware.handle(i18next);