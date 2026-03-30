import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import { extractSlipFromImage, predictSlip } from "./server/ai/orchestrator";
import { SlipStatus, SlipSource, Plan, FailedLayer, ResultSource, ConfidenceTier } from "./src/types";

// Mock Prisma client for simulation
const prisma = {
  betSlip: {
    create: async (data: any) => {
      console.log("Prisma: Creating BetSlip", data);
      return { id: data.data.id, ...data.data };
    },
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
    delete: async (args: any) => ({ id: args.where.id }),
  },
  prediction: {
    findMany: async (args: any) => [],
    create: async (data: any) => ({ id: 'pred_123', ...data.data }),
  },
  result: {
    findMany: async (args: any) => [],
    create: async (data: any) => ({ id: 'res_123', ...data.data }),
  }
};

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use(express.json());

  // --- PART 1: NEXT.JS APP ROUTER (PUBLIC & CLIENT API) ---
  
  // 1. HEALTH (/api/health)
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      formula: "v1.2.5-stable",
      db: "connected",
      load: 0
    });
  });

  // 2. USERS (/api/users)
  app.get("/api/users", (req, res) => {
    res.json({
      user: { id: 'user_123', name: 'Tony Alidu', email: 'tonyalidu@gmail.com', plan: Plan.PRO },
      limits: { dailySlips: 0, dailyPredictions: 0, remainingSlips: 0 },
      stats: { totalSlips: 0, accuracy: 0, tier1Rate: 0 }
    });
  });

  app.patch("/api/users", (req, res) => {
    const { name } = req.body;
    res.json({ status: 'success', name });
  });

  // 3. SLIPS (/api/slips)
  app.get("/api/slips", (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    res.json({
      slips: [],
      pagination: { total: 0, page: Number(page), limit: Number(limit) }
    });
  });

  app.post("/api/slips", async (req, res) => {
    const { source, rawInput, imageBase64, mimeType, matches: manualMatches, autoPredict } = req.body;
    const slipId = 'slip_' + Math.random().toString(36).substr(2, 5);
    const userId = 'user_123';
    
    let matches = manualMatches || [];
    
    try {
      if (source === SlipSource.IMAGE || source === SlipSource.OCR_IMAGE) {
        if (!imageBase64 || !mimeType) {
          return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
        }
        matches = await extractSlipFromImage(imageBase64, mimeType);
      } else if (source === SlipSource.TEXT) {
        // In a real app, we would use an LLM to parse the text
        matches = [{ match: rawInput, sport: 'football' }];
      }
      
      const slip = {
        id: slipId,
        userId,
        source,
        status: SlipStatus.PROCESSING,
        parsedMatches: matches,
        createdAt: new Date().toISOString()
      };
      await prisma.betSlip.create({ data: slip });
      
      if (autoPredict !== false) {
        predictSlip(matches, userId, slipId, io);
      }
      
      res.json({
        slipId,
        matchesExtracted: matches.length,
        status: SlipStatus.PROCESSING
      });
    } catch (error) {
      console.error("Slips Error:", error);
      res.status(500).json({ error: 'Failed to create slip' });
    }
  });

  app.get("/api/slips/:slipId", (req, res) => {
    res.json({
      slip: {
        id: req.params.slipId,
        source: SlipSource.MANUAL,
        status: SlipStatus.PREDICTED,
        createdAt: new Date().toISOString(),
        parsedMatches: []
      },
      summary: { total: 0, predicted: 0, accuracy: 0 }
    });
  });

  app.delete("/api/slips/:slipId", (req, res) => {
    res.json({ status: 'deleted', slipId: req.params.slipId });
  });

  // 4. UPLOAD (/api/upload)
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    const request = req as any;
    if (!request.file) return res.status(400).json({ error: 'No image uploaded' });
    
    try {
      const imageBuffer = fs.readFileSync(request.file.path);
      const imageBase64 = imageBuffer.toString('base64');
      const mimeType = request.file.mimetype;
      
      const matches = await extractSlipFromImage(imageBase64, mimeType);
      
      fs.unlinkSync(request.file.path);
      
      res.json({
        matches,
        imageBase64,
        mimeType
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  });

  // 5. PREDICT (/api/predict)
  app.post("/api/predict", (req, res) => {
    const { source, slipId, matchId } = req.body;
    
    res.json({
      slipId: slipId || 'manual_trigger',
      predictions: [],
      summary: {
        total: 0,
        tier1: 0,
        avgConfidence: 0,
        formulaVersion: "v1.2.5"
      }
    });
  });

  app.get("/api/predict", (req, res) => {
    const { slipId, matchId } = req.query;
    res.json(null);
  });

  // 6. RESULTS (/api/results)
  app.post("/api/results", (req, res) => {
    const { source, matchId, homeScore, awayScore, results } = req.body;
    
    const wasCorrect = false; 
    const selfHealed = false;
    
    res.json({
      verified: true,
      wasCorrect,
      selfHealed,
      failedLayer: null,
      newFormulaVersion: null,
      patchApplied: null
    });
  });

  app.get("/api/results", (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    res.json({
      predictions: [],
      stats: { total: 0, correct: 0, accuracy: 0 },
      pagination: { total: 0, page: Number(page), limit: Number(limit) }
    });
  });

  // 7. FORMULA (/api/formula)
  app.get("/api/formula", (req, res) => {
    const { view = 'active' } = req.query;
    res.json({
      version: 'v1.2.5-stable',
      layers: [
        { name: 'L1_FORM', weight: 15, description: 'Momentum detection.' },
        { name: 'L2_SQUAD', weight: 20, description: 'Injury correlation.' },
        { name: 'L3_TACTICAL', weight: 25, description: 'Formation matchups.' },
        { name: 'L4_PSYCHOLOGY', weight: 10, description: 'Pressure factors.' },
        { name: 'L5_ENVIRONMENT', weight: 10, description: 'Weather/pitch.' },
        { name: 'L6_SIMULATION', weight: 20, description: 'Monte Carlo.' },
      ],
      accuracy: 0,
      patchHistory: []
    });
  });

  app.post("/api/formula", (req, res) => {
    const { action, targetVersionId } = req.body;
    res.json({ status: 'success', action, targetVersionId });
  });

  // 8. ADMIN (/api/admin)
  app.get("/api/admin", (req, res) => {
    res.json({
      report: { uptime: '100%', activeUsers: 0, totalPredictions: 0 },
      patches: [],
      versions: [],
      usage: {}
    });
  });

  app.post("/api/admin", (req, res) => {
    res.json({ status: 'success' });
  });

  // 9. STRIPE WEBHOOK (/api/webhooks/stripe)
  app.post("/api/webhooks/stripe", (req, res) => {
    res.json({ received: true });
  });

  // --- PART 2: EXPRESS DATA ENGINE (INTERNAL TASKS) ---
  
  app.get("/health", (req, res) => res.json({ status: 'healthy', uptime: process.uptime(), formula: 'v1.2.5' }));

  app.post("/queue/predict", (req, res) => {
    const jobId = 'j_' + Math.random().toString(36).substr(2, 5);
    res.json({ jobId, status: 'queued' });
  });

  app.post("/queue/verify", (req, res) => {
    const jobId = 'j_' + Math.random().toString(36).substr(2, 5);
    res.json({ jobId, status: 'queued' });
  });

  app.get("/queue/status/:jobId", (req, res) => {
    res.json({ jobId: req.params.jobId, progress: 100, status: 'completed' });
  });

  app.get("/queue/admin/snapshot", (req, res) => {
    res.json({ queue: [], stats: { active: 0, completed: 0, failed: 0 } });
  });

  app.post("/admin/snapshot", (req, res) => {
    res.json({ status: 'snapshot_triggered' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
