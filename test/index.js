const { expect } = require('chai')
const mod = require('../src/index')


describe('basic test', function() {
   it('test 1', function() {
      expect(mod.test()).to.be.true
   })
})

describe('jack_hammer', function() {
   it('test state', function() {
      const state = mod.construct_state(4, 1);
      expect(state).to.not.be.undefined
      expect(state).to.have.property('board')
      expect(state).to.have.property('turns')
      expect(state).to.have.property('current_turn')
      expect(state).to.have.property('board_size')

   })

   it('test is_valid_space', function() {
      expect(mod.is_valid_space(3, 4)).to.be.true
      expect(mod.is_valid_space(4,4)).to.be.false
      expect(mod.is_valid_space(11,4)).to.be.true
      expect(mod.is_valid_space(17, 4)).to.be.true
   })

   it('test display', function() {
      const state = mod.construct_state(4, 1);
      mod.display_board(state);
      expect(true).to.be.true
   })

   it('test move', function() {
      const state = mod.construct_state(4, 1);
      expect(mod.get_upper_left(3, state)).to.be.undefined
      expect(mod.get_upper_right(3, state)).to.be.undefined
      expect(mod.get_lower_left(3, state)).to.have.property('state')
      expect(mod.get_lower_right(3, state)).to.have.property('state')

      expect(mod.get_upper_left(17, state)).to.have.property('state')
      expect(mod.get_upper_right(17, state)).to.have.property('state')
   })

   it('test reachable', function() {
      const state = mod.construct_state(4,1)
      expect(mod.is_reachable(state, 'p1')).to.be.true
   })
})
