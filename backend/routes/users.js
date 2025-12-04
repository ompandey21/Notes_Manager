const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notes = require("../models/Notes");
const Group = require("../models/Group");
const passport = require("passport");

router.post("/register", (req, res) => {
  const { name, email, age, role } = req.body;

  User.register(
    new User({ name, email, age, role, username: email }),
    req.body.password,
    (err, user) => {
      if (err) return res.status(400).json({ error: "Registration failed" });
      res.json({ message: "User registered", user });
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("notes_created")
      .populate("notes_shared_with_me")
      .populate("groups")
      .populate("notifications");

    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.get("/notes-created/:userId", async (req, res) => {
  try {
    const notes = await Notes.find({ owner: req.params.userId });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Failed to fetch created notes" });
  }
});

router.get("/notes-shared/:userId", async (req, res) => {
  try {
    const notes = await Notes.find({ sharedWithUsers: req.params.userId });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Failed to fetch shared notes" });
  }
});

router.post("/join-group", async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { groups: groupId }
    });

    await Group.findByIdAndUpdate(groupId, {
      $addToSet: { members: userId }
    });

    res.json({ message: "Joined group" });
  } catch {
    res.status(500).json({ error: "Failed to join group" });
  }
});

router.post("/leave-group", async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    await User.findByIdAndUpdate(userId, {
      $pull: { groups: groupId }
    });

    await Group.findByIdAndUpdate(groupId, {
      $pull: { members: userId }
    });

    res.json({ message: "Left group" });
  } catch {
    res.status(500).json({ error: "Failed to leave group" });
  }
});

router.put("/update/:userId", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
