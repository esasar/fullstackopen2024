import { useState, useEffect } from 'react'
import Bloglist from './components/Bloglist'
import Loginform from './components/Loginform'
import Addform from './components/Addform'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('error')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleAdd = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title: title,
        author: author,
        url: url
      }

      await blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setTitle('')
          setAuthor('')
          setUrl('')
        })

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

  return (
    <div class="content">
      <Notification message={notification} messageClass={notificationType} />
      {!user && <Loginform 
        handleLogin={handleLogin}
        userNameValue={username}
        onUsernameChange={({ target }) => setUsername(target.value)}
        passwordValue={password}
        onPasswordChange={({ target }) => setPassword(target.value)}
      />}
      {user && 
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in<button onClick={handleLogout}>log out</button></p>
          <Bloglist blogs={blogs} />
          <Addform 
            handleAdd={handleAdd}
            titleValue={title}
            onTitleChange={({ target }) => setTitle(target.value)}
            authorValue={author}
            onAuthorChange={({ target }) => setAuthor(target.value)}
            urlValue={url}
            onUrlChange={({ target }) => setUrl(target.value)}
          />
        </>
      }
    </div>
  )
}

export default App