import Formfield from './Formfield'
import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [titleValue, setTitleValue] = useState('')
  const [authorValue, setAuthorValue] = useState('')
  const [urlValue, setUrlValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: titleValue,
      author: authorValue,
      url: urlValue
    })

    setTitleValue('')
    setAuthorValue('')
    setUrlValue('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Formfield
          label="title: "
          type="text"
          value={titleValue}
          name="Title"
          onChange={event => setTitleValue(event.target.value)}
        />
        <Formfield
          label="author: "
          type="text"
          value={authorValue}
          name="Author"
          onChange={event => setAuthorValue(event.target.value)}
        />
        <Formfield
          label="url: "
          type="text"
          value={urlValue}
          name="Url"
          onChange={event => setUrlValue(event.target.value)}
        />
        <button type="submit">create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
}

export default BlogForm