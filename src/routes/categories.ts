import {Request, Response, NextFunction, Router} from 'express';
import data from '../json/data.json';
import { Product, Category } from '../models';
import uuidv1 from 'uuid/v1';


const router = Router();

const products: Product[] = data.products;
const categories: Category[] = data.categories;


router.get('/', (req, res) => {
    res.send(categories);
});

router.get('/:id/products', (req, res) => {
    const id:string = req.params.id;

    let matchProducts: Product[] = [];

    products.forEach((product) => {
        if(product.categoryId === id){
            matchProducts.push(product);
        }
    });

    res.send(matchProducts);
});

router.get('/:id', (req, res) => {
    res.send(categories[res.locals.matchedIndex]);
});

router.post('/', (req, res) => {
    const category = req.body;

    category.id = uuidv1();
    categories.push(category);
    res.sendStatus(201);
});

router.put('/:id', (req, res) => {
    const category: Category = req.body;

    category.id = req.params.id;
    categories[res.locals.matchedIndex] = category;
    res.send(category);
});

router.delete('/:id', (req, res) => { 
    categories.splice(res.locals.matchedIndex, 1);
    res.sendStatus(204);
});

export {router};