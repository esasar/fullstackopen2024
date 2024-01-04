const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name} you are {props.age} years old</p>
    </div>
  )
}

const Footer =  () => {
  return (
    <div>
      Greeting app creater by Esa!
      <a href="https://github.com/esasar">esasar</a>
    </div>
  )
}

const App = () => {
  const friends = [
    { name: 'Hessu', age: 33 },
    { name: 'Mikki', age: 130 },
  ]

  const namesOnly = friends.reduce((acc, friend) => {
    acc.push(friend.name);
    return acc;
  }, []);

  return (
    <>
      <Hello />
      <p>
        {
          namesOnly
        }
      </p>
      <Footer />
    </>
  )
}

export default App