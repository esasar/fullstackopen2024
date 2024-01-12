import { useState, useEffect, useRef } from 'react'
import Bloglist from './components/Bloglist'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('error')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      displayNotification('invalid username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      displayNotification(`a new blog ${blogObject.title} by ${blogObject.author} was added`, 'success')
    } catch (exception) {
      displayNotification('invalid title or url', 'error')
    }
  }

  const displayNotification = (message, type='error', timeOut=5000) => {
    setNotificationType(type)
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLike = async blog => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      title: blog.title,
      url: blog.url
    }
    await blogService.update(blog.id, blogObject)
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
  }

  const handleErase = async blog => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        displayNotification(`blog ${blog.title} by ${blog.author} was removed`, 'success')
      }
    } catch (exception) {
      displayNotification('invalid title or url', 'error')
    }
  }

  return (
    <div className="content">
      <Notification message={notification} messageClass={notificationType} />
      {!user && <LoginForm
        handleLogin={handleLogin}
        usernameValue={username}
        onUsernameChange={({ target }) => setUsername(target.value)}
        passwordValue={password}
        onPasswordChange={({ target }) => setPassword(target.value)}
      />}
      {user &&
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in<button onClick={handleLogout}>log out</button></p>
          <Bloglist blogs={blogs} handleErase={handleErase} handleLike={handleLike}/>
          <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
        </>
      }
    </div>
  )
}

export default App