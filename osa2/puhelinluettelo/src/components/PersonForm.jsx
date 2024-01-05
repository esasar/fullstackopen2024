import Button from "./Button"
import Inputfield from "./Inputfield"

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <Inputfield text={'name: '} value={props.newName} onChange={props.handleNameChange} />
      <Inputfield text={'number: '} value={props.newNumber} onChange={props.handleNumberChange} />
      <Button text={'submit'} />
    </form>
  )
}

export default PersonForm