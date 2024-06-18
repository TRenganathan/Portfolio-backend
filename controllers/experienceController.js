const { Experience } = require("../model/ExperienceSchema");

exports.addExperience = async (req, res) => {
  const { title, description, location, duration, companyName } = req.body;
  const userId = req.params.userId;

  try {
    const experience = new Experience({
      user: userId,
      title,
      description,
      location,
      duration,
      companyName,
    });
    await experience.save();
    res
      .status(200)
      .json({ message: "Experience added successfully", data: experience });
  } catch (error) {
    res.status(200).json(error);
  }
};
exports.getAllUserExperience = async (req, res) => {
  try {
    const { userId } = req.params;

    const experience = await Experience.find({ user: userId });
    if (!experience) {
      return res.status(200).json({ message: "No experience found" });
    }
    res.status(200).json({ data: experience });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
exports.updateExperience = async (req, res) => {
  try {
    const { userId, experienceId } = req.params;
    const { title, description, location, duration, companyName } = req.body;
    const experience = await Experience.findOne({
      user: userId,
      _id: experienceId,
    });
    if (!experience) {
      return res.status(200).json({ message: "No experience found" });
    }
    experience.title = title;
    experience.description = description;
    experience.location = location;
    experience.duration = duration;
    experience.companyName = companyName;
    await experience.save();
    res
      .status(200)
      .json({ message: "Experience updated successfully", experience });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
exports.deleteExperience = async (req, res) => {
  try {
    const { userId, experienceId } = req.params;

    const experience = await Experience.findByIdAndDelete({
      _id: experienceId,
      user: userId,
    });
    if (!experience) {
      return res.status(200).json({ message: "No experience found" });
    }
    await experience.save();
    res.status(200).json({ message: "Expericence deleted successfully" });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
