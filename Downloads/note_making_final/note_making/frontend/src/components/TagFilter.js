import React from 'react';

/**
 * Tag Filter Component
 */
const TagFilter = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="tag-filter">
      <button
        className={`tag-btn ${selectedTag === null ? 'active' : ''}`}
        onClick={() => onSelectTag(null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag._id}
          className={`tag-btn ${selectedTag === tag._id ? 'active' : ''}`}
          onClick={() => onSelectTag(tag._id)}
          style={{ borderColor: tag.color }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
