import express from 'express';
import loginApi from './loginApi.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(loginApi);

app.get('/', (req, res) => {
  res.send('API Server Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
