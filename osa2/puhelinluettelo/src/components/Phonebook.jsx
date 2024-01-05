import PhonebookPerson from "./PhonebookPerson"

const Phonebook = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(
        person => <PhonebookPerson key={person.id} person={person} handleDelete={() => handleDelete(person.id)} />
      )}
    </div>
  )
}

export default Phonebook