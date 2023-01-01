import express from 'express';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';
import dotenv from  'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/router.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(morgan('common'));


app.use(cors());


app.use('/', apiRouter);

// Error handler


const PORT = process.env.PORT || 5001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
}).catch((error) => console.log(`Error: ${error}`));
