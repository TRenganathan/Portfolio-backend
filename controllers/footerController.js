const { Footer } = require("../model/FooterSchema");

exports.addOrUpdateFooter = async (req, res) => {
  const { userId } = req.params;
  const {
    title,
    description,
    email,
    copyRight,
    linkedIn,
    naukuri,
    github,
    twitter,
  } = req.body;
  try {
    let footer = await Footer.findOne({ user: userId });
    if (footer) {
      footer.title = title;
      footer.description = description;
      footer.email = email;
      footer.copyRight = copyRight;
      footer.linkedIn = linkedIn;
      footer.naukuri = naukuri;
      footer.github = github;
      footer.twitter = twitter;
      await footer.save();
      return res
        .status(200)
        .json({ message: "Footer content updated successfully" });
    } else {
      const newFooter = new Footer({
        user: userId,
        ...req.body,
      });
      await newFooter.save();
      res.status(200).json({ message: "Footed content added successfully" });
    }
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
exports.getFooter = async (req, res) => {
  try {
    const { userId } = req.params;

    const footerContent = await Footer.findOne({ user: userId });
    if (!footerContent) {
      return res.status(200).json({ message: "No footer content found" });
    }
    res.status(200).json({ message: "success", data: footerContent });
  } catch (er) {
    res.status(200).json({ message: er.message });
  }
};
