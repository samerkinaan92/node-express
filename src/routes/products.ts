import {Request, Response, NextFunction, Router} from 'express';
import productsJson from '../json/products.json';
import { Product } from '../models';
import uuidv1 from 'uuid/v1';

const router = Router();

const products: Product[] = productsJson.products;

function findProductIndex(req: Request, res: Response, next: NextFunction){
    const id = req.params.id;

    if(id.length !== 36){
        res.sendStatus(400);
        return;
    }

    const matchingIndex = products.findIndex((product) =>{
        return product.id === id;
    });

    if(matchingIndex < 0){
        res.sendStatus(404);
        return;
    }

    res.locals.matchingIndex = matchingIndex;
    next();
}

router.get('/:id', findProductIndex, (req, res, next) => {
    res.send(products[res.locals.matchingIndex]);
});

router.get('/', (req, res) => {
    res.send(products);
});

router.post('/', (req, res) => {
    const product: Product = req.body;
    if(product.name.length < 3){
        res.sendStatus(409);
        return;
    }
    product.id = uuidv1();
    products.push(product);
    res.status(201).send(product);
});

router.put('/:id', findProductIndex, (req, res) => {
        const product: Product = req.body;
        const id: string = req.params.id;

        if(product.name.length < 3){
            res.sendStatus(409);
            return;
        }

        product.id = id;
        products[res.locals.matchingIndex] = product;

        res.send(product);  
      });

router.delete('/:id', findProductIndex, (req, res) => {
    products.splice(res.locals.matchingIndex, 1);

    res.sendStatus(204);
  });

export {router};