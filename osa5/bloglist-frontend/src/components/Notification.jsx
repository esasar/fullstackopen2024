const Notification = (props) => {
  const { message, messageClass } = props
  if (message === null) {
    return null
  }

  return (
    <div className={messageClass}>
      {message}
    </div>
  )
}

export default Notification