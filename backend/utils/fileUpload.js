// File: utils/fileUpload.js
const fs = require('fs');
const path = require('path');

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const uploadDirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'public', 'uploads', 'users'),
    path.join(process.cwd(), 'public', 'uploads', 'rooms')
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Delete file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    });
  }
};

module.exports = {
  ensureUploadDirs,
  deleteFile
};