import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './src/database/database';
import { log } from 'console';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

const startApp = async ()=>{
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));


    app.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
        
    });

    await connectDB;

    // ROUTES ==============================================================



    // 404 route
    app.use((req: any, res:any) =>{
        return res.status(404).json({data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: 'Failure'})
    })

}


startApp()