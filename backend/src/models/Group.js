const mongoose = require('mongoose');
const { PERMISSIONS } = require('../config/constants');

/**
 * Group Schema
 * Represents teams for collaborative note sharing
 */
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['OWNER', 'ADMIN', 'MEMBER'],
          default: 'MEMBER',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

groupSchema.index({ owner: 1 });
groupSchema.index({ 'members.userId': 1 });

/**
 * Comment Schema
 * Represents comments on notes
 */
const commentSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

commentSchema.index({ noteId: 1, createdAt: -1 });

module.exports = {
  Group: mongoose.model('Group', groupSchema),
  Comment: mongoose.model('Comment', commentSchema),
};
