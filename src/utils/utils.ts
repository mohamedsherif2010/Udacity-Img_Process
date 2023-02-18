import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Get image directory to check where images folder exisit in file structure and return it's path
export const imgdir = (dir: string = __dirname): string => {
  if (fs.readdirSync(dir).includes('images')) {
    return path.join(dir, 'images');
  } else {
    return imgdir(path.join(dir, '..'));
  }
};

export const resizeImage = async (filename: string, width: number, height: number): Promise<string> => {
  const img = path.join(imgdir(), filename + '.jpg');
  // Checks if resized folder already exisits or not and create it if not exisit to store cached imaged inside it
  if (!fs.existsSync(path.join(imgdir(), 'resized'))) {
    fs.mkdirSync(path.join(imgdir(), 'resized'));
  }
  // If the user send height and width then we will resize the image usind sharp library to specified data from user input
  // and store resized image in resized folder for cache for later use if user request it again
  if (width && height) {
    const output = path.join(path.join(imgdir(), 'resized'), `${filename}--w${width}--h${height}.jpg`);
    await sharp(img).resize({ width, height }).toFile(output);
    return output;
    // If the user send height only then we will resize the image usind sharp library to specified data from user input
    // and store resized image in resized folder for cache for later use if user request it again
  } else if (height) {
    const output = path.join(path.join(imgdir(), 'resized'), `${filename}--h${height}.jpg`);
    await sharp(img).resize({ height }).toFile(output);
    return output;
    // If the user send width only then we will resize the image usind sharp library to specified data from user input
    // and store resized image in resized folder for cache for later use if user request it again
  } else {
    const output = path.join(path.join(imgdir(), 'resized'), `${filename}--w${width}-.jpg`);
    await sharp(img).resize({ width }).toFile(output);
    return output;
  }
};

export const image = async (filename: string, width: number, height: number): Promise<string> => {
  // Check if the image already exisit and get it before resizing image
  const oimg = path.join(imgdir(), filename + '.jpg');
  if (fs.existsSync(oimg)) {
    if (!(width && height)) {
      return oimg;
    } else {
      const resize = await resizeImage(filename, width, height);
      return resize;
    }
  } else {
    return '';
  }
};
