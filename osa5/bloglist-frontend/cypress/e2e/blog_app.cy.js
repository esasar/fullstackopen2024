describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'admin user',
      username: 'admin',
      password: 'admin'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('admin')
      cy.get('input:last').type('admin')
      cy.get('#login-button').click()

      cy.contains('admin user logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('admin')
      cy.get('input:last').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'admin' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input:first').type('a blog created by cypress')
      cy.get('input:eq(1)').type('blog author by cypress')
      cy.get('input:last').type('blog.cypress')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
    })

    describe('and several blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first blogger', url: 'first.blog' })
        cy.createBlog({ title: 'second blog', author: 'second blogger', url: 'second.blog' })
        cy.createBlog({ title: 'third blog', author: 'third blogger', url: 'third.blog' })
      })

      it('one of them can be liked', function () {
        cy.contains('second blog').parent().contains('show').click()
        cy.contains('second blog').parent().contains('like').click()
        cy.contains('second blog').parent().contains('likes: 1')
      })

      it('one can be deleted', function() {
        cy.get('.blog:contains("second blog")').as('secondBlog');
        cy.get('@secondBlog').contains('show').click();
        cy.get('@secondBlog').contains('remove').click();
        cy.get('@secondBlog').should('not.exist');
      })
    })
  })
})