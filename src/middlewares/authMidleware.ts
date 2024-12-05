
import jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../utils/generateToken';




export const verifyUserToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization denied: No Bearer token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = decodeToken(token);
  
      if (decoded.role !== 'user') {
        return res.status(403).json({ error: 'Access denied: Users only' });
      }
  
      req.user = decoded; // Attach user info to the request object
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };


    //   Admin verification middleware
    export const verifyAdminToken = (req: any, res: any, next:any) => {
        const authHeader = req.headers.authorization;
      
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Authorization denied: No Bearer token provided' });
        }
      
        const token = authHeader.split(' ')[1];
      
        try {
          const decoded = decodeToken(token);
      
          if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
          }
      
          req.user = decoded; // Attach user info to the request object
          next();
        } catch (error) {
          return res.status(401).json({ error: 'Invalid or expired token' });
        }
      };


