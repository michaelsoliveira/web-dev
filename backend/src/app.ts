import express from 'express';
import cors from 'cors';
import routes from './routes'

const app = express()

app.use(cors());
app.use(express.json());

app.get('/health', (req: any, res: any) => {
    res.json({ ok: true, uptime: process.uptime() })
});

app.use('/api', routes);
export default app;