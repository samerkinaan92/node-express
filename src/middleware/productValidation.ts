import { Request, Response, NextFunction, Router } from "express";
import data from "../json/data.json";
import { Product } from "../models";
import { idValidation, nameValidation } from "../validations/product";
import joi from "joi";

const router = Router();

const products: Product[] = data.products;

function findProductIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  const { error, value } = joi.validate(id, idValidation);
  if (error) {
    throw error;
  }

  const matchingIndex = products.findIndex(product => {
    return product.id === id;
  });

  if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.matchingIndex = matchingIndex;
  next();
}

function validateName(req: Request, res: Response, next: NextFunction) {
  const product: Product = req.body;
  const { error, value } = joi.validate(product.name, nameValidation);
  if (error) {
    throw error;
  }
  next();
}

router.get("/:id", findProductIndex);
router.post("/", validateName);
router.put("/:id", findProductIndex, validateName);
router.delete("/:id", findProductIndex);

export { router };
