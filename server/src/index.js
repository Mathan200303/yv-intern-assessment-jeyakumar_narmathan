
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import membershipTypeRoutes from './routes/membershipTypeRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

import ENDPOINTS from './utils/endpoints.js';

app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.AUTH, authRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.ROLES, roleRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.PERMISSIONS, permissionRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.AUDIT_LOGS, auditRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.APPLICATIONS, applicationRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.MEMBERS, memberRoutes);
app.use(ENDPOINTS.API_PREFIX + ENDPOINTS.MEMBERSHIP_TYPES, membershipTypeRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
