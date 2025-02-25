// models/News.js
const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "daily news",
        "latest news",
        "mizoram news",
        "business",
        "education and health",
        "sports and entertainment",
        "interviews",
        "panels",
      ],
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: ["english", "burmese", "chin"],
      required: true,
    },
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true, // For SEO-friendly URLs (e.g., /news/this-is-the-title)
      trim: true,
    },
    description: { type: String, required: true },
    images: [{ type: String }], // Store URLs or filenames
    videos: [{ type: String }], // Store video URLs or filenames
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedDate: {

    }
  },
  { timestamps: true }
);

NewsSchema.plugin(require("mongoose-paginate-v2"));

module.exports = mongoose.model("News", NewsSchema);
