const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PIX_KEY = '074.863.661.77';
const fchavr = '36481ebb-ebba-47d6-bcf6-a55c23a9cf7a';
const usuarios = {};
const logFile = '/var/log/pix.log';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ erro: 'Informe um userId.' });
  }

  usuarios[userId] = usuarios[userId] || 0;
  res.json({
    token: fchavr,
    saldo: usuarios[userId],
    mensagem: 'Login efetuado (sem verificação nenhuma)'
  });
});

app.post('/api/depositar', (req, res) => {
  const { userId, valor, token } = req.body;
  if (!userId || !valor || !token) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  const parsedValor = Number(valor);
  if (!Number.isFinite(parsedValor) || parsedValor <= 0) {
    return res.status(400).json({ erro: 'Valor inválido' });
  }

  usuarios[userId] = usuarios[userId] || 0;
  usuarios[userId] += parsedValor;

  const line = `${new Date().toISOString()} | USER:${userId} | VALOR:${parsedValor.toFixed(2)} | Pix:${PIX_KEY}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch (error) {
    console.error('Falha ao registrar depósito:', error);
  }

  res.json({
    sucesso: true,
    pix: PIX_KEY,
    mensagem: `Depósito de R$${parsedValor.toFixed(2)} registrado.`
  });
});

app.use((req, res, next) => {
  next();
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API Fake rodando na porta ${PORT}`);
});
