import express, { Request, Response } from 'express';
import { checkImg, checkDim } from './middlewares';
import { image } from './utils/utils';
// Make object of server
const app = express();
// Define port to work with
const port = 3000;

app.use([checkImg, checkDim]);
// Get route for image endpoint
app.get('/image', async (req: Request, res: Response): Promise<void> => {
  const { filename, height, width } = req.query;
  res.sendFile(await image(filename as string, parseInt(height as string), parseInt(width as string)));
});

// Initiate server and start listening to port
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
export default app;
