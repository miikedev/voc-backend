const News = require("../models/news.model")
// Create News
exports.createNews = async (req, res) => {
  try {
    const {
      category,
      language,
      title,
      slug,
      description,
      images,
      videos,
      author,
      status
    } = req.body;

    const news = new News({
      category,
      language,
      title,
      slug,
      description,
      images,
      videos,
      author,
      status
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read All News with Search and Filtering
exports.getAllNews = async (req, res) => {
  try {
    const {
      category,
      language,
      search,
      status,
      page = 1,
      limit = 10,
      sort = 'publishDate',
      order = 'desc'
    } = req.query;

    // Build query object
    const query = {};
    
    if (category) query.category = category;
    if (language) query.language = language;
    if (status) query.status = status === 'true';
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: order === 'desc' ? -1 : 1 },
      populate: 'author' // Populate author details if needed
    };

    const news = await News.paginate(query, options);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read Single News
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author');
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update News
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedDate: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete News
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
