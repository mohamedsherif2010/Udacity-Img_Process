import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { imgdir } from '../utils/utils';

export const checkImg = (req: Request, res: Response, next: NextFunction): void => {
  const filename = req.query.filename;
  if (filename) {
    if (fs.existsSync(path.join(imgdir(), filename + '.jpg'))) {
      next();
    } else {
      res.status(404).send('filename not found');
    }
  } else {
    res.status(400).send('filename is required');
  }
};

export const checkDim = (req: Request, res: Response, next: NextFunction): void => {
  const { height, width } = req.query;
  const heightNum = parseInt(height as string);
  const widthNum = parseInt(width as string);
  let send = true;
  if (widthNum <= 0 || (width && !widthNum)) {
    res.status(400).send('width must be a number > zero');
    send = false;
  } else if (heightNum <= 0 || (height && !heightNum)) {
    res.status(400).send('height must be a number > zero');
    send = false;
  } else if (send) {
    next();
  } else {
    return;
  }
};
