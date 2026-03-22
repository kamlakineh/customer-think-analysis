import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/companies', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) return res.status(500).json({ error: error.message });
    
    // Map snake_case to camelCase
    const mapped = data.map(item => ({
      ...item,
      createdAt: item.created_at
    }));
    res.json(mapped);
  });

  app.post('/api/companies', async (req, res) => {
    const { createdAt, ...rest } = req.body;
    const { data, error } = await supabase.from('companies').insert([{
      ...rest,
      created_at: createdAt || new Date().toISOString()
    }]).select();
    
    if (error) return res.status(500).json({ error: error.message });
    
    const item = data[0];
    res.json({
      ...item,
      createdAt: item.created_at
    });
  });

  app.delete('/api/companies/:id', async (req, res) => {
    const { error } = await supabase.from('companies').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.patch('/api/companies/:id', async (req, res) => {
    const { createdAt, ...rest } = req.body;
    const updateData: any = { ...rest };
    if (createdAt) updateData.created_at = createdAt;

    const { data, error } = await supabase.from('companies').update(updateData).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const item = data[0];
    res.json({
      ...item,
      createdAt: item.created_at
    });
  });

  app.get('/api/customers', async (req, res) => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) return res.status(500).json({ error: error.message });
    
    const mapped = data.map(item => ({
      ...item,
      companyId: item.company_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      arrivalTime: item.arrival_time
    }));
    res.json(mapped);
  });

  app.post('/api/customers', async (req, res) => {
    const { companyId, createdAt, updatedAt, arrivalTime, ...rest } = req.body;
    const { data, error } = await supabase.from('customers').insert([{
      ...rest,
      company_id: companyId,
      created_at: createdAt || new Date().toISOString(),
      updated_at: updatedAt || new Date().toISOString(),
      arrival_time: arrivalTime
    }]).select();
    
    if (error) {
      console.error('Supabase error (POST /api/customers):', error);
      return res.status(500).json({ error: error.message });
    }
    
    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Failed to create customer' });
    }

    const item = data[0];
    res.json({
      ...item,
      companyId: item.company_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      arrivalTime: item.arrival_time
    });
  });

  app.patch('/api/customers/:id', async (req, res) => {
    const { companyId, createdAt, updatedAt, arrivalTime, ...rest } = req.body;
    const updateData: any = { ...rest };
    if (companyId) updateData.company_id = companyId;
    if (createdAt) updateData.created_at = createdAt;
    if (updatedAt) updateData.updated_at = updatedAt;
    if (arrivalTime) updateData.arrival_time = arrivalTime;

    const { data, error } = await supabase.from('customers').update(updateData).eq('id', req.params.id).select();
    if (error) {
      console.error('Supabase error (PATCH /api/customers):', error);
      return res.status(500).json({ error: error.message });
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const item = data[0];
    res.json({
      ...item,
      companyId: item.company_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      arrivalTime: item.arrival_time
    });
  });

  app.delete('/api/customers/:id', async (req, res) => {
    const { error } = await supabase.from('customers').delete().eq('id', req.params.id);
    if (error) {
      console.error('Supabase error (DELETE /api/customers):', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
