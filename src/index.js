const { Observable, from } = require('rxjs')
const { map } = require('rxjs/operators')

exports.test = function() {
   return true
}

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

exports.construct_state = function(board_size, max_turns) {
   if(board_size < 0)
      throw "Invalid board size"

   if(max_turns < 0)
      throw "Invalid number of turns"
   console.log('constructing board %s', board_size)
   let board = []
   let mesh_size = (board_size + board_size - 1) * board_size
   console.log('mesh_size %s', mesh_size);
   for(let i = 0; i < mesh_size; ++i) {
      if(is_valid_space(i, board_size)) {
//         console.log('index %s is a valid space', i)
         board[i] = {state:"o"} // state is o,x,<player number" all strings
      }
      else
         board[i] = undefined 
   }
   return {
      board,
      current_turn:0,
      turns:max_turns,
      board_size
   };
}

exports.display_board = function(state) {
   if(!state)
      throw "state cannot be undefined"

   if(!state.board)
      throw "no board found"
   if(!state.board_size || state.board_size < 0)
      throw "board_size is invalid"
   const rows = Math.floor(state.board.length / (2 * state.board_size - 1))
   console.log('expected rows %s', rows)
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
