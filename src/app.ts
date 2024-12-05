import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/database';
import { log } from 'console';
import userRoutes from './user/userRoutes/userAuthRoute';
import mongoose from 'mongoose';

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

         
      await connectDB();
    


    // ROUTES ==============================================================
    app.use('/api/user/auth', userRoutes);


    // 404 route
    app.use((req: any, res:any) =>{
        return res.status(404).json({data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: 'Failure'})
    })

}


startApp()