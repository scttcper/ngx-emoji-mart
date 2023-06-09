describe('Emoji picker', () => {
  beforeEach(() => cy.visit('/'));

  it('should render list of emojis', () => {
    cy.get('.emoji-mart-scroll').should('be.visible');
  });

  it('should update preview emoji when emoji is hovered', () => {
    cy.get('.emoji-mart-search').type('thumbs up');

    const emoji = cy.get('.emoji-mart-scroll ngx-emoji:visible span').first();

    emoji.trigger('mouseenter');

    cy.get('.emoji-mart-preview').should('contain.text', ':thumbsup:');

    emoji.trigger('mouseleave');

    cy.get('.emoji-mart-preview').should('not.contain.text', ':thumbsup:');
  });
});
