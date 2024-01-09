import Blog from './Blog'

const Bloglist = ({ blogs }) => (
  <div className='bloglist'>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)

export default Bloglist