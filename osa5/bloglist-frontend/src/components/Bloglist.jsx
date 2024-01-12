import Blog from './Blog'
import PropTypes from 'prop-types'

const Bloglist = ({ blogs, handleErase, handleLike }) => (
  <div className='bloglist'>
    {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
      <Blog key={blog.id} blog={blog} handleErase={handleErase} handleLike={handleLike} />
    )}
  </div>
)

Bloglist.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleErase: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired
}

export default Bloglist