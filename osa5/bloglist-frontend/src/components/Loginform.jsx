import Formfield from './Formfield'

const Loginform = (props) => {
  return (
    <div className='loginform'>
      <h2>log in to application</h2>
      <form onSubmit={props.handleLogin}>
        <Formfield 
          label="username: " 
          type="text" 
          value={props.usernameValue}
          name="Username"
          onChange={props.onUsernameChange}
        />
        <Formfield 
          label="password: " 
          type="text" 
          value={props.passwordValue}
          name="Password"
          onChange={props.onPasswordChange}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Loginform