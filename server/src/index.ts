import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tokensRouter from './routes/tokens';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tokens', tokensRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 