import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('', async () => {
    const user = userEvent.setup()
    const handleAdd = jest.fn()

    const { container } = render(<BlogForm addBlog={handleAdd} />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'test title')
    await user.type(inputs[1], 'test author')
    await user.type(inputs[2], 'test.url')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(handleAdd.mock.calls).toHaveLength(1)
    expect(handleAdd.mock.calls[0][0].title).toBe('test title')
    expect(handleAdd.mock.calls[0][0].author).toBe('test author')
    expect(handleAdd.mock.calls[0][0].url).toBe('test.url')
  })
})