import React from 'react'

import badImport from './fileDOesNotExits'

console.log(badImport)
export const Sample: React.FC<{ a: number }> = (props) => {
  return <div>{props.foo + props.bar}</div>
}

export const Sample2: React.FC<{ a: number }> = (props) => {
  return (
    <div>
      <span olala="sss">
        {props.foo1 + props.bar1 + props.foo2 + props.bar2}
      </span>
    </div>
  )
}
