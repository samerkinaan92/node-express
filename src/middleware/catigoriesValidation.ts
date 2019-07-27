import {Request, Response, NextFunction, Router} from 'express';
import { Category } from '../models';
import joi from 'joi';
import {idValidation} from '../validations/validation';
import request from 'request-promise';


const router = Router();



async function findCategoryIndex(req: Request, res: Response, next: NextFunction){
    const id:string = req.params.id;

    const client = request.defaults({
        baseUrl: 'http://localhost:3000/public',
        json: true,
    });

    const data = await client.get('/data.json');
    const categories: Category[] = data.categories;

    const {error, value} = joi.validate(id, idValidation);
    if(error){
        next(error);
    }

    const matchedIndex = categories.findIndex((category) => {
        return category.id === id;
    });

    if(matchedIndex < 0){
        res.sendStatus(404);
        return;
    }

    res.locals.matchedIndex = matchedIndex;
    next();
}

router.get('/:id', findCategoryIndex);
router.get('/:id/products', findCategoryIndex);
router.put('/:id', findCategoryIndex);
router.delete('/:id', findCategoryIndex);

export {router};

