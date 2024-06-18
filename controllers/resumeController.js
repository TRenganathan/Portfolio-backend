const { Resume } = require("../model/ResumeSchema");
const resumeUpload = require("./resumeUpload");
const baseURL = process.env.BASE_URL;
exports.updateResume = async (req, res) => {
  resumeUpload(req, res, async (err) => {
    if (err) {
      return res.status(200).json({ message: err });
    }

    try {
      const { userId } = req.params;
      const resumepath = req.file ? req.file.path : null;

      let existingResume = await Resume.findOne({ user: userId });
      if (existingResume) {
        existingResume.resume = resumepath;
        await existingResume.save();
        return res.status(200).json({
          message: "Resume uploaded successfully",
          data: existingResume,
        });
      } else {
        const newResume = new Resume({
          user: userId,
          resume: resumepath,
        });
        await newResume.save();
        res.status(200).json({
          message: "New Resume updated successfully",
          data: newResume,
        });
      }
    } catch (error) {
      res.status(200).json({ message: error });
    }
  });
};
exports.getResume = async (req, res) => {
  try {
    const { userId } = req.params;
    let resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(200).json({ message: "No resume found" });
    }

    if (resume?.resume) {
      resume.resume = `${baseURL}/` + resume.resume;
    }
    res.status(200).json({ data: resume });
  } catch (error) {}
};
