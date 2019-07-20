import express from 'express';
import {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import productsJson from './json/products.json';
import { Product } from './models/product';
import uuidv1 from 'uuid/v1';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

app.get('/products/:id', findProductIndex, (req, res, next) => {
    res.send(products[res.locals.matchingIndex]);
});

app.get('/products', (req, res) => {
    res.send(products);
});

app.post('/products', (req, res) => {
    const product: Product = req.body;
    if(product.name.length < 3){
        res.sendStatus(409);
        return;
    }
    product.id = uuidv1();
    products.push(product);
    res.status(201).send(product);
});

app.put('/products/:id', findProductIndex, (req, res) => {
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

app.delete('/products/:id', findProductIndex, (req, res) => {
    products.splice(res.locals.matchingIndex, 1);

    res.sendStatus(204);
  });

export {app};

