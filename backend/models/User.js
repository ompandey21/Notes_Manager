const { Schema, model } = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    age: {
      type: Number,
      required: true,
      min: 5,
    },

    role: {
      type: String,
      required: true, // "user", "admin"
      enum: ["user", "admin"],
    },

    notes_created: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],

    notes_shared_with_me: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],

    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);

// Add PLM plugin → adds username + hashed password
userSchema.plugin(plm, { usernameField: "email" });

module.exports = model("User", userSchema);
