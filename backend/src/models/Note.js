const mongoose = require('mongoose');
const { PERMISSIONS } = require('../config/constants');

/**
 * Tag Schema
 * Represents tags for organizing notes
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
      match: /^#[0-9A-F]{6}$/i,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

/**
 * Ensure unique tags per owner
 */
tagSchema.index({ name: 1, owner: 1 }, { unique: true });

/**
 * Note Version Schema
 * Stores version history for notes
 */
const noteVersionSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeReason: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

/**
 * Share Record Schema
 * Tracks note sharing and permissions
 */
const shareRecordSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    permission: {
      type: String,
      enum: Object.values(PERMISSIONS),
      default: PERMISSIONS.VIEW,
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

/**
 * Note Schema
 * Core note document with rich text content
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    isShared: {
      type: Boolean,
      default: false,
    },
    shares: [shareRecordSchema],
    currentVersion: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Index for efficient querying
 */
noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ owner: 1, isDeleted: 1 });
noteSchema.index({ title: 'text', content: 'text' });

module.exports = {
  User: require('./User'),
  Note: mongoose.model('Note', noteSchema),
  Tag: mongoose.model('Tag', tagSchema),
  NoteVersion: mongoose.model('NoteVersion', noteVersionSchema),
  ShareRecord: mongoose.model('ShareRecord', shareRecordSchema),
};
