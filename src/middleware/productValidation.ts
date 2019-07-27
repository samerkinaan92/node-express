import { Request, Response, NextFunction, Router } from "express";
import { Product } from "../models";
import { idValidation, nameValidation } from "../validations/validation";
import joi from "joi";
import request from "request-promise";

const router = Router();

async function findProductIndex(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  const { error, value } = joi.validate(id, idValidation);
  if (error) {
    next(error);
  }

  const client = request.defaults({
    baseUrl: "http://localhost:3000/public",
    json: true
  });

  const data = await client.get("/data.json");
  const products: Product[] = data.products;

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
    next(error);
  }
  next();
}

router.get("/:id", findProductIndex);
router.post("/", validateName);
router.put("/:id", findProductIndex, validateName);
router.delete("/:id", findProductIndex);

export { router };
