import {Request, Response, NextFunction, Router} from 'express';
import data from '../json/data.json';
import { Category } from '../models';
import joi from 'joi';
import {idValidation} from '../validations/product';


const router = Router();

const categories: Category[] = data.categories;

function findCategoryIndex(req: Request, res: Response, next: NextFunction){
    const id:string = req.params.id;

    const {error, value} = joi.validate(id, idValidation);
    if(error){
        throw error;
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

