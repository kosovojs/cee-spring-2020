import { combineReducers } from 'redux'
import appReducer from './components/App/appSlice'
/* import mainReducer from './components/ToolPage/slice'
import dataReducer from './components/ResultsList/slice' */

export default combineReducers({
  app: appReducer,
  //main: mainReducer,
  //data: dataReducer
})
