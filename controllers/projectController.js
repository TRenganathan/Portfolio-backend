const upload = require("../middleware");
const { Project } = require("../model/projectSchema");
require("dotenv").config();
const baseURL = process.env.BASE_URL;
exports.getProjects = async (req, res) => {
  const userId = req.params.userId;
  try {
    const projects = await Project.find({ user: userId });
    if (!projects) {
      return res.status(200).json({ message: "Projects not found" });
    }
    const projectWithImageUrl = projects?.map((prj) => ({
      ...prj.toJSON(),
      languagesUsed: prj.languagesUsed,
      projectImage: prj.projectImage.map((path) => `${baseURL}/${path}`),
    }));
    res.status(200).json({ message: "success", data: projectWithImageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a new project
exports.addProject = async (req, res) => {
  upload(req, res, async (er) => {
    if (er) {
      return res.status(200).json({ message: er });
    } else {
      try {
        const { userId } = req.params;
        const files = req.files;
        const filePaths = files.map((file) => file.path);

        const newProject = new Project({
          user: userId,
          ...req.body,
          projectImage: filePaths,
          languagesUsed: JSON.parse(req.body.languagesUsed),
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
      } catch (error) {
        res.status(200).json({ message: error.message });
      }
    }
  });
};
// Edit a project
exports.editProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(200).json({ message: err });
    } else {
      try {
        const { userId, projectId } = req.params;
        const files = req.files;
        // const filePaths = files.map((file) => file.path);

        const { title, description, role, projectURL, languagesUsed } =
          req.body;
        const filePaths = files.map((file) => file.path);
        let project = await Project.findOne({ _id: projectId, user: userId });
        if (!project) {
          return res.status(200).json({ message: "project not found" });
        }

        project.title = title;
        project.description = description;
        project.role = role;
        project.projectURL = projectURL;
        project.languagesUsed = languagesUsed;
        if (filePaths.length > 0) {
          project.projectImage = filePaths;
        }

        // const updatedProjectData = {
        //   ...req.body,
        // };

        // if (files.length > 0) {
        //   updatedProjectData.projectImage = filePaths;
        // }

        // const updatedProject = await Project.findOneAndUpdate(
        //   { _id: projectId, user: userId },
        //   { $set: updatedProjectData },
        //   { new: true }
        // );

        // if (!updatedProject) {
        //   return res.status(404).json({ message: "Project not found" });
        // }

        await project.save();

        res
          .status(200)
          .json({ message: "Project updated successfully", project });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    }
  });
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      user: userId,
    });

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
