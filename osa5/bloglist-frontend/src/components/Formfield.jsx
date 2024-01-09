const Formfield = (props) => {
  return(
    <div className='formField'>
      <label>
        {props.label}
      </label>
      <input
        type={props.type}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
      />
    </div>
  )
}

export default Formfield