import { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistics = ({ ratings }) => {
  const [good, neutral, bad] = ratings
  if (good + neutral + bad === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  const total = ratings.reduce((acc, cur) => acc + cur)
  const positive = good
  const score = ratings[0] * 1 + ratings[1] * 0 + ratings[2] * (-1)

  return (
    <>
      <table>
        <tbody>
          <StatisticsLine name="good" value={good} />
          <StatisticsLine name="neutral" value={neutral} />
          <StatisticsLine name="bad" value={bad} />
          <StatisticsLine name="all" value={total} />
          <StatisticsLine name="average" value={score/total} />
          <StatisticsLine name="positive" value={100 * positive/total} />
        </tbody>
      </table>
    </>
  )
}

const StatisticsLine = ({ name, value }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <>
      <h1>Give feedback</h1>
      <Button text='Good' handleClick={handleGoodClick}/>
      <Button text='Neutral' handleClick={handleNeutralClick}/>
      <Button text='Bad' handleClick={handleBadClick}/>
      <h1>Statistics</h1>
      <Statistics ratings={[good, neutral, bad]} />
    </>
  )
}

export default App
