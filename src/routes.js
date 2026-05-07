const express = require('express');
const router = express.Router();

router.get('/ready', (req, res) => {
  res.status(200)
    .json({"ready": true}
    );}
);

const vectorSearch = require('./vectorSearch.js');

router.post('/fraud-score', async (req, res) => {
  try {
    const result = await vectorSearch.vectorSearch();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;