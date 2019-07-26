import {Request, Response, NextFunction, Router} from 'express';
import data from '../json/data.json';
import { Product } from '../models';
import uuidv1 from 'uuid/v1';

const router = Router();

const products: Product[] = data.products;

router.get('/:id', (req, res, next) => {
    res.send(products[res.locals.matchingIndex]);
});

router.get('/', (req, res) => {
    res.send(products);
});

router.post('/', (req, res) => {
    const product: Product = req.body;
    product.id = uuidv1();
    products.push(product);
    res.status(201).send(product);
});

router.put('/:id', (req, res) => {
        const product: Product = req.body;
        const id: string = req.params.id;

        product.id = id;
        products[res.locals.matchingIndex] = product;

        res.send(product);  
      });

router.delete('/:id', (req, res) => {
    products.splice(res.locals.matchingIndex, 1);

    res.sendStatus(204);
  });

export {router};