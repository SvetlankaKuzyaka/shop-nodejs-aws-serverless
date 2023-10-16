'use strict';

import { productsMocked } from './mocks/data.js';

export const getProductsList = async () => {
  const products = await productsMocked;

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

export const getProductsById = async (event) => {
  const productId = event.pathParameters?.productId;
  const products = await productsMocked;

  const productById = products.find((product) => product.id === productId);

  return {
    statusCode: 200,
    body: JSON.stringify(productById),
  };
};
