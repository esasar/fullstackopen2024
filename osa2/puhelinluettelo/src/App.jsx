import { useState, useEffect } from 'react'
import axios from 'axios'
import Inputfield from './components/Inputfield'
import Phonebook from './components/Phonebook'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [messageState, setMessageState] = useState()

  useEffect(() => {
    axios
      .get('/api/persons')
      .then(res => {
        setPersons(res.data)
    })
  }, [])

  const personsToShow = persons.filter(person => 
    person.name
      .toLowerCase()
      .includes(filterName.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === personObject.name)
    // Null is falsy
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        axios
          .put(`/api/persons/${existingPerson.id}`, personObject)
          .then(res => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : res.data))
            setNewName('')
            setNewNumber('')
            setMessageState('success')
            setNotificationMessage(`Replaced number of ${res.data.name}`)
            setTimeout(() => { setNotificationMessage(null) }, 5000)
          })
      }
      return
    }
    
    axios
      .post('/api/persons', personObject)
      .then(res => {
        setPersons(persons.concat(res.data))
        setNewName('')
        setNewNumber('')
        setMessageState('success')
        setNotificationMessage(`Added ${res.data.name}`)
        setTimeout(() => { setNotificationMessage(null) }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      axios
        .delete(`/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotificationMessage(`Deleted ${personToDelete.name}`)
          setMessageState('success')
          setTimeout(() => { setNotificationMessage(null) }, 5000)
        })
        .catch(() => {
          setNotificationMessage(`Information of ${personToDelete.name} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== id))
          setMessageState('error')
          setTimeout(() => { setNotificationMessage(null) }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} messageType={messageState}/>
      <Inputfield text={'filter shown with: '} value={filterName} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Phonebook persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
