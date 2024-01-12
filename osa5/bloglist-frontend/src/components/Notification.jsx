import PropTypes from 'prop-types'

const Notification = ({ message, messageClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={messageClass}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  messageClass: PropTypes.string.isRequired
}

export default Notification