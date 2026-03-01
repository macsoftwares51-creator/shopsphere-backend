const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.deckqjqrp,
  api_key: process.env.932553454141212,
  api_secret: process.env.Le46iQMDvXdIG60aXngS_yO-eIc
});

module.exports = cloudinary;
