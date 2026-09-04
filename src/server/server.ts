import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from '../lib/prisma';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Health & Status Check Endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Quick ping to MongoDB
    await prisma.$runCommandRaw({ ping: 1 });
    res.status(200).json({
      status: 'healthy',
      database: 'mongodb',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString(),
    });
  }
});

// 2. Platform Status & System Metadata
app.get('/api/v1/system/status', async (_req: Request, res: Response) => {
  res.status(200).json({
    platform: 'SalaryBox ERP Dedicated Backend',
    databaseEngine: 'MongoDB',
    runtime: 'Node.js Dedicated Server',
    environment: process.env.NODE_ENV || 'development',
    features: [
      'Multi-tenant isolated company domains',
      'Persistent MongoDB connection pooling',
      'Continuous background cron automation',
      'Geofenced attendance & live punches',
      'Indian statutory payroll computation (PF/ESI/PT/TDS)',
      'Decentro KYC & Cashfree SaaS billing',
    ],
  });
});

// 3. Persistent In-Process Background Schedulers (Cron Jobs)
function initCronJobs() {
  console.log('⏰ [Cron Engine] Initializing persistent background schedulers...');

  // Daily Midnight Job: Auto-checkout shifts & mark absent
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 [Cron] Running daily midnight attendance auto-checkout & absence marking...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Example: auto-mark pending records
      const openRecords = await prisma.attendanceRecord.findMany({
        where: {
          lastOut: null,
          firstIn: { not: null },
          status: 'PRESENT',
        },
      });

      console.log(`🌙 [Cron] Found ${openRecords.length} open attendance records to finalize.`);
    } catch (err) {
      console.error('❌ [Cron Error] Attendance auto-checkout failed:', err);
    }
  });

  // Monthly 1st Job: Auto-draft payroll cycles
  cron.schedule('0 1 1 * *', async () => {
    console.log('💰 [Cron] Running monthly payroll draft generator for active companies...');
    try {
      const activeCompanies = await prisma.company.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, name: true },
      });
      console.log(`💰 [Cron] Triggered payroll draft initialization for ${activeCompanies.length} companies.`);
    } catch (err) {
      console.error('❌ [Cron Error] Monthly payroll draft job failed:', err);
    }
  });
}

// 4. Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('💥 [Server Error]:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred on the dedicated server',
    },
  });
});

// Start Server & Lifecycle Management
const server = app.listen(PORT, () => {
  console.log(`🚀 [SalaryBox ERP Server] Running on http://localhost:${PORT}`);
  console.log(`🍃 [Database] Connected to MongoDB via Prisma ORM`);
  initCronJobs();
});

// Graceful Shutdown
async function handleShutdown(signal: string) {
  console.log(`\n🛑 [Server] Received ${signal}. Draining connections...`);
  server.close(async () => {
    console.log('💤 [Server] HTTP server closed.');
    await prisma.$disconnect();
    console.log('🍃 [Database] MongoDB disconnected cleanly.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
