const PhonebookPerson = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={handleDelete}>Poista</button>
    </p>
  )
}

export default PhonebookPerson