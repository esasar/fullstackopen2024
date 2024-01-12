import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test.url',
    likes: 42,
    user: {
      username: 'test user'
    }
  }

  const handleEraseMockHandler = jest.fn()
  const handleLikeMockHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        handleErase={handleEraseMockHandler}
        handleLike={handleLikeMockHandler}
      />
    ).container
  })

  test('only renders blog title initially', () => {
    const title = screen.queryByText('test title')
    expect(title).not.toBeNull()

    const author = screen.queryByText('author: test author')
    expect(author).toBeNull()

    const url = screen.queryByText('test.utl')
    expect(url).toBeNull()

    const likes = screen.queryByText('likes: 42')
    expect(likes).toBeNull()

    const user = screen.queryByText('test user')
    expect(user).toBeNull()
  })

  test('renders all information when show is pressed', async () => {
    const mockUser = userEvent.setup()
    const showButton = screen.getByText('show')
    await mockUser.click(showButton)

    const title = screen.queryByText('test title')
    expect(title).not.toBeNull()

    const author = screen.queryByText('author: test author')
    expect(author).not.toBeNull()

    const url = screen.queryByText('test.url')
    expect(url).not.toBeNull()

    const likes = screen.queryByText('likes: 42')
    expect(likes).not.toBeNull()

    const user = screen.queryByText('test user')
    expect(user).not.toBeNull()
  })

  test('increments like amount correctly on button press', async () => {
    const mockUser = userEvent.setup()
    const showButton = screen.getByText('show')
    await mockUser.click(showButton)

    const likeButton = screen.getByText('like')
    await mockUser.click(likeButton)
    await mockUser.click(likeButton)

    expect(handleLikeMockHandler.mock.calls).toHaveLength(2)
  })
})