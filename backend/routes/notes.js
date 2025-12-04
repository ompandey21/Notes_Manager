const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const User = require("../models/User");
const Group = require("../models/Group");

router.post("/create", async (req, res) => {
  try {
    const { title, content, owner, tags, category } = req.body;

    const note = await Notes.create({
      title,
      content,
      owner,
      tags,
      category
    });

    await User.findByIdAndUpdate(owner, {
      $push: { notes_created: note._id }
    });

    res.json({ message: "Note created", note });
  } catch {
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.get("/my-notes/:userId", async (req, res) => {
  try {
    const notes = await Notes.find({ owner: req.params.userId });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get("/shared-with-me/:userId", async (req, res) => {
  try {
    const notes = await Notes.find({ sharedWithUsers: req.params.userId });
    res.json(notes);
  } catch {
    res.status(500).json( {error: "Failed to fetch shared notes" });
  }
});

router.get("/group/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("notesSharedInGroup");
    res.json(group.notesSharedInGroup);
  } catch {
    res.status(500).json({ error: "Failed to fetch group notes" });
  }
});

router.put("/update/:noteId", async (req, res) => {
  try {
    const { title, content, lastEditedBy, tags, category } = req.body;

    const oldNote = await Notes.findById(req.params.noteId);

    oldNote.versionHistory.push({
      content: oldNote.content,
      updatedAt: new Date()
    });

    oldNote.title = title ?? oldNote.title;
    oldNote.content = content ?? oldNote.content;
    oldNote.tags = tags ?? oldNote.tags;
    oldNote.category = category ?? oldNote.category;
    oldNote.lastEditedBy = lastEditedBy;

    await oldNote.save();

    res.json({ message: "Note updated", oldNote });
  } catch {
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/delete/:noteId", async (req, res) => {
  try {
    await Notes.findByIdAndDelete(req.params.noteId);
    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

router.post("/share/users", async (req, res) => {
  try {
    const { noteId, userIds } = req.body;

    const note = await Notes.findByIdAndUpdate(
      noteId,
      { $addToSet: { sharedWithUsers: { $each: userIds } } },
      { new: true }
    );

    for (let id of userIds) {
      await User.findByIdAndUpdate(id, {
        $push: { notes_shared_with_me: noteId }
      });
    }

    res.json({ message: "Note shared with users", note });
  } catch {
    res.status(500).json({ error: "Failed to share note" });
  }
});

router.post("/share/groups", async (req, res) => {
  try {
    const { noteId, groupIds } = req.body;

    const note = await Notes.findByIdAndUpdate(
      noteId,
      { $addToSet: { sharedWithGroups: { $each: groupIds } } },
      { new: true }
    );

    for (let group of groupIds) {
      await Group.findByIdAndUpdate(group, {
        $push: { notesSharedInGroup: noteId }
      });
    }

    res.json({ message: "Note shared with groups", note });
  } catch {
    res.status(500).json({ error: "Failed to share with group" });
  }
});

router.post("/comment/:noteId", async (req, res) => {
  try {
    const { user, text } = req.body;

    const note = await Notes.findByIdAndUpdate(
      req.params.noteId,
      {
        $push: {
          comments: { user, text, timestamp: new Date() }
        }
      },
      { new: true }
    );

    res.json(note);
  } catch {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.get("/tag/:tagName", async (req, res) => {
  try {
    const notes = await Notes.find({ tags: req.params.tagName });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Tag filter failed" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const notes = await Notes.find({ category: req.params.category });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Category filter failed" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const notes = await Notes.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } }
      ]
    });

    res.json(notes);
  } catch {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
