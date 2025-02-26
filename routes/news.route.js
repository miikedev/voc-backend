// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/news.model');
const newsController = require('../controllers/news.controller');

router.post('/', newsController.createNews);
router.get('/', newsController.getAllNews);
router.get('/:slug', newsController.getNewsById);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);



module.exports = router;