import express from 'express';
import cors from "cors";
import doctorRoutes from './routes/doctor';
import cityRoutes from './routes/cities';
import specialiatyRoutes from './routes/specialities';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/doctors", doctorRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/specialities", specialiatyRoutes);

export default app;
