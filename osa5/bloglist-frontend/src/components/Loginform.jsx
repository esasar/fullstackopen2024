import Formfield from './Formfield'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, usernameValue, onUsernameChange, passwordValue, onPasswordChange }) => {
  return (
    <div className='loginform'>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <Formfield
          label="username: "
          type="text"
          value={usernameValue}
          name="Username"
          onChange={onUsernameChange}
        />
        <Formfield
          label="password: "
          type="text"
          value={passwordValue}
          name="Password"
          onChange={onPasswordChange}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  usernameValue: PropTypes.string.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  passwordValue: PropTypes.string.isRequired,
  onPasswordChange: PropTypes.func.isRequired
}

export default LoginForm