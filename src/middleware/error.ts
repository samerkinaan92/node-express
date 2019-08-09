import { Request, Response, NextFunction } from 'express';

export function validationError(err: Error, req: Request, res: Response, next: NextFunction){
    res.sendStatus(400);
}