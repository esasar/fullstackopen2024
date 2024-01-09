import Formfield from './Formfield'

const Addform = (props) => {
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={props.handleAdd}>
        <Formfield 
          label="title: " 
          type="text" 
          value={props.titleValue}
          name="Title"
          onChange={props.onTitleChange}
        />
        <Formfield 
          label="author: " 
          type="text" 
          value={props.authorValue}
          name="Author"
          onChange={props.onAuthorChange}
        />
        <Formfield 
          label="url: " 
          type="text" 
          value={props.urlValue}
          name="Url"
          onChange={props.onUrlChange}
        />
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default Addform