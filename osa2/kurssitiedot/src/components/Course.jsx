const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
    </>
  )
}


const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}
  
const Content = ({ course }) => {
  const parts = course.parts.map(
    part => <Part key={part.id} name={part.name} exercises={part.exercises} />
  )

  const total =  course.parts.reduce((acc, cur) => acc + cur.exercises, 0)

  return (
    <div>
      {parts}
      <p><b>Total of {total} exercises</b></p>
    </div>
  )
}
  
const Part = (props) => {
  return (
    <p>{props.name} {props.exercises}</p>
  )
}
  

export default Course