import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';

// import { AppError } from './common/utils/appError'
// import globalErrorHandler from './common/error-handling/errorController'

import authRouter from './auth/routers/auth.routes';
import * as dotenv from 'dotenv';



const port = '3000'
const app = express();
dotenv.config();


// ip secure gibi bilgileri dogru sekilde almak icin
app.enable('trust proxy');


// .pug uzantılı dosyalarını alır ve dinamik HTML'ye dönüştürür.
// app.set('view engine', 'pug');


// tüm .pug dosyalarının bu klasörde olduğunu varsayıyor.
// app.set('views', path.join(__dirname, 'views'));


// Implement cors
// farkli porttan baglanilmaya izin verilmez, cors bunu cozer 
app.use(cors());


// Ben bu kaynağa POST, PUT, DELETE gibi bir metodla erişmek istiyorum, izin veriyor musun?
// app.options('*', cors());


// Statik dosyalari tarayiciya dogrudan acar. 
app.use(express.static(path.join(__dirname, 'public')));


// helmet, Express için yazılmış bir güvenlik kalkanıdır. Uygulamanı tarayıcı kaynaklı bazı saldırılara karşı korur.
// Guvenlik basliklari bununla gelir
app.use(helmet());


// Sadece uygulama development (geliştirme) ortamında çalışıyorsa, morgan isimli log middleware'ini aktifleştirir.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// DDOS saldirilarina karsi koruma  
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);


// limit: '10kb' demek: JSON body maksimum 10 kilobyte olabilir.
// Böylece aşırı büyük veriyle sunucunu çökertmeye çalışan saldırılara karşı korunmuş olursun (💥 DoS attack gibi).
app.use(express.json({ limit: '10kb' }));
// Form verilerini isler, boyutu belirler,  ic ice objeleri kullanmaya yarddimci.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Tarayıcıdan gelen çerezleri (cookies) okur.
app.use(cookieParser());


// injection saldirilarina karsi, gelen veriden "$", "." yi siler.
// app.use(mongoSanitize());



// birden fazla parametre gondermesini engeller
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);


// Express.js uygulamanıza gzip veya deflate gibi sıkıştırma algoritmaları ekler. 
// Bu, web sayfalarının boyutlarını küçültür ve böylece kullanıcıların daha hızlı yüklemeler yapmasını sağlar.
app.use(compression());


// gelen istege zaman ekler
app.use((req, res, next) => {
    req.app.set("requestTime", new Date().toISOString());
    // console.log(req.cookies);
    next();
});

// route ayarlari
app.use('/auth', authRouter);


// app.all('*', ...) → Uygulamadaki tüm HTTP metodları (GET, POST, PUT, vs.) ve tüm yollar (*) için çalışır.
// Yani bu route tanımlanmamış bir URL’ye gelen tüm istekleri yakalar.
// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server working on http://localhost:${port}`)
});