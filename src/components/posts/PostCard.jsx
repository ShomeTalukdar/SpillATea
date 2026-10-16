import React from 'react';
import ConfessionCard from '../confessions/ConfessionCard';

/**
 * PostCard maps to the daily ConfessionCard component.
 */
export default function PostCard(props) {
  const post = props.post || props.confession || {};
  const normalized = {
    ...post,
    confession_number: post.confession_number || post.post_number_formatted || `#${post.id}`,
    body: post.body || post.content || '',
    to_target: post.to_target || (post.title && post.title !== post.content ? post.title : null),
    category: post.category || 'Confessions',
    time_formatted: post.time_formatted || 'Recently',
    exact_time: post.exact_time || 'Today'
  };

  return <ConfessionCard {...props} confession={normalized} />;
}
