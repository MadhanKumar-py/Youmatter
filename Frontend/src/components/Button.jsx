

const Button = (props) => {
  return (
    <button style={props.style} className={props.class} onClick={props.click}>{props.text} {props.children}</button>
  )
}

export default Button