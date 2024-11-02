const express = require("express");
const multer = require("multer");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("./cloudinary");

const router = express.Router();

// Multer configuration to handle video uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Single video upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary directly from memory
    const result = await uploadMediaToCloudinary(req.file.buffer);
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading video" });
  }
});

// Single video delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Video deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting video" });
  }
});

// Bulk video upload route
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.buffer)
    );

    const results = await Promise.all(uploadPromises);
    res.status(200).json({ success: true, data: results });
  } catch (event) {
    console.error(event);
    res.status(500).json({ success: false, message: "Error in bulk uploading videos" });
  }
});

module.exports = router;
