import PropTypes from 'prop-types'

const Formfield = ({ label, type, value, name, onChange }) => {
  return(
    <div className='formField'>
      <label>
        {label}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
      />
    </div>
  )
}

Formfield.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Formfield