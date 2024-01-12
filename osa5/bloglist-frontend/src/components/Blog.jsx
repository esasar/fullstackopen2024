import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleErase, handleLike }) => {
  const [viewInfo, setViewInfo] = useState(false)

  const clickHandler = () => {
    setViewInfo(!viewInfo)
  }

  const currentUser = JSON.parse(window.localStorage.getItem('loggedBloglistAppUser'))

  const isCurrentUserBlogUser = () => {
    if (currentUser) {
      return currentUser.username === blog.user.username
    }
    return false
  }

  return (
    <div className="blog">
      <p className="title">{blog.title}</p>
      {viewInfo &&
      <>
        <p>author: {blog.author}</p>
        <p>likes: {blog.likes}<button onClick={() => handleLike(blog)} className='likeButton'>like</button></p>
        {isCurrentUserBlogUser() && <button onClick={() => handleErase(blog)}>remove</button>}
        <p>{blog.url}</p>
        <p>{blog.user.username}</p>
      </>
      }
      <button onClick={clickHandler}>{viewInfo ? 'hide' : 'show'}</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleErase: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired
}

export default Blog