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

   it('test process player', function() {
      const state = mod.construct_state(4, 1)
      mod.process_player('ul', state, 'p1')
      expect(state.board[3].state).to.equal('1')
      expect(state.p1).to.equal(3)
      mod.process_player('ll', state, 'p1')
      expect(state.board[3].state).to.equal('o')
      expect(state.board[9].state).to.equal('1')
      expect(state.p1).to.equal(9)
      mod.process_player('j_rt', state, 'p1')
      expect(state.board[9].state).to.equal('1')
      expect(state.board[11].state).to.equal('x')
      expect(state.p1).to.equal(9)

      mod.process_player('j_lt', state, 'p1')
      expect(state.board[9].state).to.equal('1')
   })

   it('test move', function() {
      const state = mod.construct_state(4, 1);
      expect(mod.get_upper_left(3, state)).to.be.undefined
      expect(mod.get_upper_right(3, state)).to.be.undefined
      expect(mod.get_lower_left(3, state)).to.have.property('state')
      expect(mod.get_lower_right(3, state)).to.have.property('state')
      expect(mod.get_left(3, state)).to.be.undefined
      expect(mod.get_right(3, state)).to.be.undefined

      expect(mod.get_upper_left(17, state)).to.have.property('state')
      expect(mod.get_upper_right(17, state)).to.have.property('state')
      expect(mod.get_left(17, state)).to.have.property('state')
      expect(mod.get_right(17, state)).to.have.property('state')

      expect(mod.get_left(9, state)).to.be.undefined
   })

   it('test reachable', function() {
      const state = mod.construct_state(4,1)
      expect(mod.is_reachable(state, 'p1')).to.equal(0)

      state.board[15].state = 'x'
      //state.board[17].state = 'x'
      state.board[19].state = 'x'

      state.board[23].state = 'x'
      state.board[25].state = 'x'
      mod.display_board(state)
      expect(mod.is_reachable(state, 'p1')).to.equal(4)
      expect(mod.is_reachable(state, 'p2')).to.equal(1)
   })
})
