const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../model/User");
const { Project } = require("../model/projectSchema");
const { Experience } = require("../model/ExperienceSchema");
const Profile = require("../model/profileSchema");

exports.getAllUsers = async (req, res) => {
  let users;
  try {
    users = await User.find({})
      .select("-password -recoveryKeys -gridItems -blogs -totpSecret")
      .populate({ path: "profile", select: "profilePicture role" });
  } catch (error) {
    console.log(error);
  }
  if (!users || users.length == 0) {
    return res.status(200).json({ message: "User not found" });
  }
  res.status(200).json({ data: users });
};
exports.addUsers = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const users = await User.findOne({ email });

    if (users) {
      res.status(200).json({ message: "user already created" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log("error while hashing");

          return;
        }
        try {
          const totpSecret = speakeasy.generateSecret({ length: 20 });
          const recoveryKeys = Array.from({ length: 10 }, () => uuidv4());
          // await User.create({
          //   name,
          //   email,
          //   totpSecret,
          //   recoveryKeys,
          //   password: hash,
          //   blogs: [],
          //   isAdmin: false, // Explicitly setting isAdmin to false
          // });
          const newUser = new User({
            name,
            email,
            totpSecret,
            recoveryKeys,
            password: hash,
            blogs: [],
            isAdmin: false, // Explicitly setting isAdmin to false
          });
          const savedUser = await newUser.save();
          const defaultProject = {
            user: savedUser._id,
            title: "Modern portfolio app with amazing animation",
            description:
              "This is one of the best portfolio examples if you want to focus on displaying your work and updates and sharing your knowledge",

            languagesUsed: ["Javascript", "react", "drupal", "twig", "next js"],
            projectURL:
              "https://demo.drupalthemes.io/business-plus/drupal-9-theme/home-1",
          };

          const newProject = new Project(defaultProject);
          await newProject.save();

          const defaultExperience = {
            user: savedUser._id,
            title: "MERN stack Developer",
            description:
              "Developed and maintained user-facing features using modern web technologies using Next js and Node JS.",
            location: "Coimbatore",
            companyName: "Iprotecs solution",
            duration: "June-23 - Present",
          };
          const newExperience = new Experience(defaultExperience);
          await newExperience.save();
          res.status(200).json({ message: "user created successfully" });
        } catch (error) {
          res
            .status(500)
            .json({ message: "cannot created user", err: error.message });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "cannot created user" });
  }
};
exports.signInUser = async (req, res) => {
  const { email, password, totpCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({ message: "user not found" });
    }
    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) return;
      if (result) {
        try {
          const accessToken = jwt.sign(
            { email: email, userId: existingUser._id },
            process.env.TOKEN_PRIVATE_KEY,
            { expiresIn: "1d" }
          );
          const refreshToken = jwt.sign(
            {
              email: email,
              userId: existingUser._id,
            },
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "1d" }
          );
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          const userData = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            is2faEnabled: false,
            username: existingUser.email,
            userId: existingUser.id,
            isAdmin: existingUser.isAdmin,
            name: existingUser.name,
          };

          if (existingUser.totpSecret) {
            // var tokenValidates = speakeasy.totp.verify({
            //   secret: existingUser.totpSecret.base32,
            //   encoding: "base32",
            //   token: totpCode,
            // });
            // if (tokenValidates) {
            //   return res
            //     .status(200)
            //     .json({ message: "login success", userData });
            // } else {
            //   return res.status(200).json({ message: "2fa not verified" });
            // }
            const userData = {
              accessToken: accessToken,
              refreshToken: refreshToken,
              is2faEnabled: true,
              totpSecret: existingUser.totpSecret.base32,
              username: existingUser.email,
              userId: existingUser.id,
              isAdmin: existingUser.isAdmin,
              name: existingUser.name,
            };
            return res.status(200).json({ message: "login success", userData });
          } else {
            return res.status(200).json({ message: "login success", userData });
          }
        } catch (error) {
          res.status(200).json({ message: "failed", data: error.message });
        }
      } else {
        res.status(200).json({ message: "incorrect password" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: "failed", data: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(200).json({ message: "No user found" });
    }
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
exports.verifyRefreshToken = async (req, res) => {
  try {
    const { email, refreshToken } = req.body;
    // const refreshToken = req.cookie.jwt
    const existingUser = await User.findOne({ email });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      (err, decoded) => {
        if (err) {
          return res.status(404).jswon({ message: "unauthorized" });
        }
        if (decoded) {
          const newAccessToken = jwt.sign(
            {
              email: email,
              userId: existingUser?._id,
            },
            process.env.TOKEN_PRIVATE_KEY,
            { expiresIn: "15m" }
          );
          res
            .status(200)
            .json({ message: "success", accessToken: newAccessToken });
        }
      }
    );
  } catch (er) {
    return res.status(404).json({ message: "unauthorized" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(404).json({ message: "Invalid token for verify", err });
    }
    req.id = user.userId;
  });
  next();
};

exports.verifyTotp = async (req, res) => {
  const { email, totpCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({ message: "user not found" });
    }

    try {
      const accessToken = jwt.sign(
        { email: email, userId: existingUser._id },
        process.env.TOKEN_PRIVATE_KEY,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        {
          email: email,
          userId: existingUser._id,
        },
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn: "1d" }
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      const userRecoveryKeys = existingUser?.recoveryKeys;
      const userData = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        recoveryKey: userRecoveryKeys,
      };

      if (existingUser.totpSecret) {
        var tokenValidates = speakeasy.totp.verify({
          secret: existingUser.totpSecret.base32,
          encoding: "base32",
          token: totpCode,
        });
        if (tokenValidates) {
          return res.status(200).json({ message: "login success", userData });
        } else {
          return res
            .status(200)
            .json({ statusCode: 404, message: "unauthorized" });
        }
      } else {
        return res.status(200).json({ message: "login success", userData });
      }
    } catch (error) {
      res.status(200).json({ message: "failed", data: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: "failed", data: error.message });
  }
};
exports.verifyTotpRecoveryKey = async (req, res) => {
  const { email, recoveryKey } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({ message: "user not found" });
    }

    try {
      const accessToken = jwt.sign(
        { email: email, userId: existingUser._id },
        process.env.TOKEN_PRIVATE_KEY,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        {
          email: email,
          userId: existingUser._id,
        },
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn: "1d" }
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const userData = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      if (existingUser.recoveryKeys) {
        const userRecoveryKeys = existingUser.recoveryKeys;
        console.log(userRecoveryKeys);
        function verifyRecoveryKey(recoveryKey) {
          return userRecoveryKeys.includes(recoveryKey);
        }
        if (verifyRecoveryKey(recoveryKey)) {
          const updatedCart = await User.findOneAndUpdate(
            { _id: existingUser._id },
            {
              $pull: { recoveryKeys: recoveryKey },
              // $set: { name: "jerin T" },
            }, // Pull (remove) the product from the products array

            { new: true } // Return the updated document
          );

          return res
            .status(200)
            .json({ message: "login success", updatedCart });
        } else {
          return res
            .status(200)
            .json({ statusCode: 404, message: "unauthorized" });
        }
      } else {
        return res.status(200).json({ message: "login success", userData });
      }
    } catch (error) {
      res.status(200).json({ message: "failed", data: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: "failed", data: error.message });
  }
};
exports.addPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log("error while hashing");
          return;
        }
        try {
          if (user.password) {
            return res.status(200).json({ message: "Password already set" });
          }
          user.password = hash;
          await user.save();
          res.status(200).json({ message: "Password set successfully" });
        } catch (e) {
          console.log(e.message);
        }
      });
    }
  } catch (e) {}
};
