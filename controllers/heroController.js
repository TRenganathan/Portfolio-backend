const { Hero } = require("../model/HeroSchema");

exports.addHeroContent = async (req, res) => {
  const { title, tagLine, description } = req.body;
  const userId = req.params.userId;
  console.log();
  try {
    let hero = await Hero.findOne({ user: userId });
    if (hero) {
      hero.title = title;
      hero.tagLine = tagLine;
      hero.description = description;
      await hero.save();
      res.status(200).json({ message: "Hero content updated successfully" });
    } else {
      // If hero section does not exist, create a new one
      hero = new Hero({
        user: userId,
        title,
        tagLine,
        description,
      });
      await hero.save();
      res.status(200).json({ message: "Hero content added successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
exports.getHeroContent = async (req, res) => {
  const userId = req.params.userId;
  try {
    const heroContent = await Hero.findOne({ user: userId });
    if (heroContent) {
      res.status(200).json({ data: heroContent });
    } else {
      res.status(200).json({ message: "No hero content" });
    }
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
