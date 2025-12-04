const { Schema, model } = require("mongoose");

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true // Rich text stored as HTML
    },

    category: {
      type: String,
      trim: true,
      enum: ["work", "personal", "urgent", "college", "other"],
      default: "other",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    sharedWithUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    sharedWithGroups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group"
      }
    ],

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        text: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    versionHistory: [
      {
        content: String,
        updatedAt: Date
      }
    ],

    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = model("Notes", notesSchema);
