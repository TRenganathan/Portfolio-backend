// controllers/profileController.js

const upload = require("../middleware");
const { User } = require("../model/User");
const Profile = require("../model/profileSchema");
const profilePictureUpload = require("./profileFileUpload");
const baseURL = process.env.BASE_URL;
exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(200).json({ message: "Profile not found" });
    }
    if (profile?.profilePicture) {
      profile.profilePicture = `${baseURL}/` + profile.profilePicture;
    }

    res.status(200).json({ message: "success", data: profile });
  } catch (error) {
    res.status(200).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  profilePictureUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { userId } = req.params;
      const {
        name,
        email,
        phone,
        role,
        totalProjects,
        totalExperience,
        currentCTC,
        expectedCTC,
        myInfo,
      } = req.body;
      const profileImage = req.file ? req.file.path : null;

      const updateFields = {
        name,
        email,
        phone,
        role,
        totalProjects,
        totalExperience,
        currentCTC,
        expectedCTC,
        myInfo,
      };

      if (profileImage) {
        updateFields.profilePicture = profileImage;
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: updateFields },
        { new: true, upsert: true }
      );
      await User.findByIdAndUpdate(userId, { profile: updatedProfile._id });
      res.status(200).json({ message: "success", data: updatedProfile });
    } catch (error) {
      res.status(200).json({ message: "Server error", error: error.message });
    }
  });
};
