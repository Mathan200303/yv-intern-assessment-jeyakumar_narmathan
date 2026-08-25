require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const auditRoutes = require('./routes/auditRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const memberRoutes = require('./routes/memberRoutes');
const membershipTypeRoutes = require('./routes/membershipTypeRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const ENDPOINTS = require('./utils/endpoints');

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
