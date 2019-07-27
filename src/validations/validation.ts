import joi from 'joi';

export const idValidation = joi.string().length(36).required();

export const nameValidation = joi.string().min(3).required();