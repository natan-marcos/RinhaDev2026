app.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'Rodando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid
  });
});

app.post('/fraud-score', (req, res) => {
  res.json({
    received: req.body,
    timestamp: new Date().toISOString()
  });
});