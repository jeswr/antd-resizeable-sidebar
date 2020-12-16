import Sider, { SiderProps } from 'antd/lib/layout/Sider'
// eslint-disable-next-line no-use-before-define
import React, { useReducer } from 'react'

// Add tests to make sure most behavior matches siders
// TODO: Make work on RHS
// TODO: Optimize

// Cast minwidth as number to allow for % etc.
function GetWidth (props: SiderProps, xpos: number): number | (string & {}) {
  if (typeof props.style?.minWidth === 'number' && xpos < props.style.minWidth) {
    return props.style.minWidth
  } else if (typeof props.style?.maxWidth === 'number' && xpos > props.style.maxWidth) {
    return props.style.maxWidth
  } else {
    return xpos
  }
}

export function AntdResisableSider (props: SiderProps) {
  const [state, dispatch] = useReducer((state: { down: boolean, resizable: boolean, width: number | (string & {}) }, action: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (action.type === 'mousedown' && state.resizable) {
      return { down: true, width: GetWidth(props, action.pageX), resizable: true }
    } else if (action.type === 'mouseup' && state.down) {
      return { down: false, width: GetWidth(props, action.pageX), resizable: action.pageX - 7 < state.width && action.pageX + 7 > state.width }
    } else if (action.type === 'mousemove' && action.pageX !== state.width) {
      const resizable = action.pageX - 7 < state.width && action.pageX + 7 > state.width
      if (state.down) {
        return { down: true, width: GetWidth(props, action.pageX), resizable: true }
      } else if (state.resizable !== resizable) {
        return { ...state, resizable }
      }
    }
    // else if (state.down) {
    //   return { down: action.type !== 'mouseup', width: GetWidth(props, action.pageX), resizable: resizable || action.type !== 'mouseup' }
    // };
    // if (state.resizable !== resizable) {
    //   return { ...state, resizable }
    // }
    return state
  }, { down: false, resizable: false, width: 200 })
  document.addEventListener('mouseup', dispatch)
  document.addEventListener('mousemove', dispatch)
  return (
    <Sider
      {...props}
      style={{
        ...props.style,
        ...(state.resizable ? { cursor: 'ew-resize' } : {})
      }}
      width={state.width}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (state.resizable) {
          dispatch(e)
        }
        // Allows any mousdown events from parent to still occur
        props.onMouseDown?.(e)
      }}
    />
  )
}
