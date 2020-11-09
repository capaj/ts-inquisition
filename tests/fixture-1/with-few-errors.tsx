import React from 'react';

export const Sample: React.FC<{ a: number }> = (props) => {
  return <div>{props.foo + props.bar}</div>;
};
