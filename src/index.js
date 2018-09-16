const { Observable, from } = require('rxjs')
const { map } = require('rxjs/operators')
const readline = require('readline')
const fs = require('fs')
exports.test = function() {
   return true
}

const get_impl = (index, state, row_direction, direction) => {
   if(index < 0 )
      throw "index must be greater than 0"
   if(!state)
      throw "no state"
   if(index >= state.board.length)
      throw "invalid index; greater than mesh size"
   const mesh_size = state.board.length
   const row_length = 2 * state.board_size - 1
   const row = Math.floor(index/row_length)
   const row_index = index % row_length
   const upper_row = row + row_direction
   if(upper_row >= 0 && upper_row < state.board_size) {
      const upper_left_index = row_index + direction 
      if(upper_left_index >= 0 && upper_left_index < row_length)
         return upper_row * row_length + upper_left_index
   }

}

const get_upper_left = (index, state) => {
   const idx = get_impl(index, state, -1, -1)
   if(idx !== undefined)
      return state.board[idx]
}

const get_upper_right = (index, state) => {
   const idx = get_impl(index, state, -1, 1)
   if(idx !== undefined)
      return state.board[idx]
}

const get_lower_left = (index, state) => {
   const idx = get_impl(index, state, 1, -1)
   if(idx !== undefined)
      return state.board[idx]
}

const get_lower_right = (index, state) => {
   const idx = get_impl(index, state, 1, 1)
   if(idx !== undefined)
      return state.board[idx]
}

const get_left = (index, state) => {
   const idx = get_impl(index, state, 0, -2);
   if(idx !== undefined)
      return state.board[idx]
}

const get_right = (index, state) => {
   const idx = get_impl(index, state, 0, 2);
   if(idx !== undefined)
      return state.board[idx]
}

exports.get_upper_left = get_upper_left
exports.get_upper_right = get_upper_right
exports.get_lower_left = get_lower_left
exports.get_lower_right = get_lower_right
exports.get_left = get_left
exports.get_right = get_right

const travel = function(current_index, index, rem, travel_direction) {
   while(rem > 0) {
      if(current_index === index)
         return true;
      rem --;
      current_index += 2 * travel_direction;
   }
   return false   
}

const is_valid_space = function(index, board_size) {

   if(index < 0)
      throw "Invalid index"
   if(board_size < 0)
      throw "Invalid board_size"

   const width = board_size + (board_size - 1)
   const height = board_size
   const total = width * height

   // what row is the index
   const row = Math.floor(index / width);
   const row_index = index % width;
   const num_valid_space = row + 1
   const center_index = Math.floor(width/2)

   const rem = Math.floor(num_valid_space/2);
   if(row % 2 == 0) {
//      console.log('looking at even row %s, row_index %s, center_index %s, rem %s', row, row_index, center_index, rem)
      // only odd indices are valid
      if(row_index == center_index)
         return true;

      // travel to the left until
      if(row_index < center_index) {
         return travel(center_index - 2, row_index, rem, -1);
      }

      // travel to the right
      else {
         return travel(center_index + 2, row_index, rem, +1);
      }
   }

   else {
//      console.log('looking at odd row %s, row_index %s', row, row_index)
      if(row_index < center_index) {
         return travel(center_index - 1, row_index, rem, -1);
      }

      else {
         return travel(center_index + 1, row_index, rem, +1)
      }
   }
}

exports.is_valid_space = is_valid_space

const check = (state, player, pos) => {
   if(state[player] === pos)
      return false
   return pos === state.p1 || pos === state.p2 || pos === state.p3
}

const is_reachable = (state, player) => {
   if(state === undefined)
      throw "state not found"
   
   if(!is_valid_space(state[player], state.board_size)) {
      throw "Invalid player position"
   }

   state.board.forEach(v => {
      if(v)
         delete v.visited
   })

   let stack = [state[player]]
   while(stack.length > 0) {
      let pos = stack.pop()
      state.board[pos].visited = true
      let ul = get_impl(pos, state, -1, -1)
      let ur = get_impl(pos, state, -1, 1)
      let ll = get_impl(pos, state, 1, -1)
      let lr = get_impl(pos, state, 1, 1)
      let left = get_impl(pos, state, 0, -2)
      let right = get_impl(pos, state, 0, 2)

      if(state[player] !== pos) {
         console.log("checking if %s neighbors is occupied by a player since this was reached by %s", pos, state[player])
         if(check(state, player, ul))
            return true
         else if(check(state, player, ur))
            return true
         else if(check(state, player, ll))
            return true
         else if(check(state, player, lr))
            return true
         else if(check(state, player, left))
            return true
         else if(check(state, player, right))
            return true

      }
         
      if(ul !== undefined && state.board[ul] && !state.board[ul].visited) {
         stack.push(ul)
      }
      
      if(ur !== undefined && state.board[ur] && !state.board[ur].visited) {
         stack.push(ur)
      }

      if(ll !== undefined && state.board[ll] && !state.board[ll].visited) {
         stack.push(ll)
      }

      if(lr !== undefined && state.board[lr] && !state.board[lr].visited) {
         stack.push(lr)
      }
      if(left !== undefined && state.board[left] && !state.board[left].visited) {
         stack.push(left)
      }
      if(right !== undefined && state.board[right] && !state.board[right].visited) {
         stack.push(right)
      }

   }


}

exports.is_reachable = is_reachable

// initializes the board
const construct_state = function(board_size, max_turns) {
   if(board_size < 0)
      throw "Invalid board size"

   if(max_turns < 0)
      throw "Invalid number of turns"
   console.log('constructing board %s', board_size)
   let board = []
   const row_length = 2 * board_size - 1
   let mesh_size = row_length * board_size
//   console.log('mesh_size %s', mesh_size);
   for(let i = 0; i < mesh_size; ++i) {
      if(is_valid_space(i, board_size)) {
//         console.log('index %s is a valid space', i)
         board[i] = {state:"o"} // state is o,x,<player number" all strings
      }
      else
         board[i] = undefined 
   }
   const p1 = Math.floor(row_length / 2)
   const p2 = (board_size  - 1) * row_length 
   const p3 = mesh_size - 1
//   console.log('p1 = %s, p2 = %s, p3 = %s', p1, p2, p3)
   board[p1].state = "1"
   board[p2].state = "2"
   board[p3].state = "3"
   return {
      board,
      current_turn:0,
      turns:max_turns,
      board_size,
      p1, // player1 position
      p2, // player2 position
      p3  // player3 position
   };
}

exports.construct_state = construct_state

const display_board = function(state) {
   if(!state)
      throw "state cannot be undefined"

   if(!state.board)
      throw "no board found"
   if(!state.board_size || state.board_size < 0)
      throw "board_size is invalid"
   const rows = Math.floor(state.board.length / (2 * state.board_size - 1))
//   console.log('expected rows %s', rows)
   const row_width = state.board_size + state.board_size - 1;
 //  console.log(state)
   for(let r = 0; r < rows; ++r) {
      let slice = state.board.slice(r * row_width, (r+1) * row_width);
      console.log(slice.map(v => {
         if(v)
            return v.state
         return " "
      }))
   }
}

exports.display_board = display_board

const process_move = (move, state, player) => {
   if(move === 'ul') {
      return get_impl(state[player], state, -1, -1)
   }
   else if(move === 'll') {
      return get_impl(state[player], state, 1, -1)
   }
   else if(move === 'lr') {
      return get_impl(state[player], state, 1, 1)
   }
   else if(move === 'ur') {
      return get_impl(state[player], state, -1, 1)
   }
   else if(move === 'lt') {
      return get_impl(state[player], state, 0, -2)
   }
   else if(move === 'rt') {
      return get_impl(state[player], state, 0, 2)
   }
}

const process_jackhammer = (move, state, player) => {
   if(move === 'j_ul') {
      return get_impl(state[player], state, -1, -1) 
   }
   else if(move === 'j_ur') {
      return get_impl(state[player], state, -1, 1)
   }

   else if(move === 'j_ll') {
      return get_impl(state[player], state, 1, -1)
   }

   else if(move === 'j_lr') {
      return get_impl(state[player], state, 1, 1)
   }

   else if(move === 'j_lt') {
      return get_impl(state[player], state, 0, -2)
   }
   else if(move === 'j_rt') {
      return get_impl(state[player], state, 0, 2)
   }

}

const make_move = (index, state, player) => {
   if(state.board[index] && state.board[index].state === 'o') {
      state.board[state[player]].state = 'o'
      state[player] = index
      state.board[index].state = player[1]
   }
}

const process_player = (p, state, player) => {
   let move;
//   console.log('move %s', p)
   if((move = process_move(p, state, player)) !== undefined)
      make_move(move, state, player)
   if((move = process_jackhammer(p, state, player)) !== undefined) {
      if(state.board[move])
         state.board[move].state = 'x'
   }

}

exports.process_player = process_player

const run_turn = (state, turns, p1_input, p2_input, p3_input) => {
   console.log('running turn: %s', turns)
   if(turns > 0) {
      let p1, p2, p3;
      const r = readline.createInterface({
         input: process.stdin,
         output: process.stdout
      })
      //console.log(p1_input)
      // get player 1 move
      const pone_input = p1_input || ((cb) => {
         r.question('player 1 move (ul, ur, ll, lr, lt, rt, j_ul, j_ur, j_ll, j_lr, j_lt, j_rt, p) : ', cb)
      })
      const ptwo_input = p2_input || ((cb) => {
         r.question('player 2 move  (ul, ur, ll, lr, lt, rt, j_ul, j_ur, j_ll, j_lr, j_lt, j_rt, p) : ', cb)
      })
      const pthree_input = p3_input || ((cb) => {
         r.question('player 3 move (ul, ur, ll, lr, lt, rt, j_ul, j_ur, j_ll, j_lr, j_lt, j_rt, p) : ', cb)
      })


      pone_input(data => {
         p1 = data
         ptwo_input(data => {
            p2 = data
            pthree_input(data => {
               p3 = data
               r.close()
               process_player(p1, state, 'p1')
               process_player(p2, state, 'p2')
               process_player(p3, state, 'p3')
               display_board(state)
               run_turn(state, turns - 1, p1_input, p2_input, p3_input)
            })
         })
      })
      // get player 2 move

      // get player 3 move

   }
}

exports.run_turn = run_turn

if(process.env.NODE_ENV === 'production') {
   const r = readline.createInterface({
      input: process.stdin,
      output: process.stdout
   })
   r.question("Board Size? > ", data => {
      let board_size = parseInt(data)
      r.question("Num Turns? > ", data => {
         let p1 = undefined
         let p2 = undefined
         let p3 = undefined
         if(process.env.PLAYER1) {
            let data = fs.readFileSync(process.env.PLAYER1, 'utf-8')
            data = data.split('\n')
            console.log(data)
            p1 = cb => {
               cb(data.shift())
            }
         }
         if(process.env.PLAYER2) {
            let data = fs.readFileSync(process.env.PLAYER2, 'utf-8')
            data = data.split('\n')
            console.log(data)
            p2 = cb => {
               cb(data.shift())
            }

         }
         if(process.env.PLAYER3) {
            let data = fs.readFileSync(process.env.PLAYER3, 'utf-8')
            data = data.split('\n')
            console.log(data)
            p3 = cb => {
               cb(data.shift())
            }

         }
         r.close()
         let num_turns = parseInt(data)
         const state = construct_state(board_size, num_turns)
         display_board(state)
         run_turn(state, num_turns, p1, p2, p3)
      })
   })
}
