import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit';

const port = '3000'
const app = express();

// ip secure gibi bilgileri dogru sekilde almak icin
app.enable('trust proxy');

// .pug uzantılı dosyalarını alır ve dinamik HTML'ye dönüştürür.
app.set('view engine', 'pug');

// tüm .pug dosyalarının bu klasörde olduğunu varsayıyor.
app.set('views', path.join(__dirname, 'views'));

// Implement cors
// farkli porttan baglanilmaya izin verilmez, cors bunu cozer 
app.use(cors());

// Ben bu kaynağa POST, PUT, DELETE gibi bir metodla erişmek istiyorum, izin veriyor musun?
app.options('*', cors());

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




app.listen(port, () => {
    console.log(`Server working on http://localhost:${port}`)
});


