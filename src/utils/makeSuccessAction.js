import { merge, mergeDeep } from 'immutable'

/**
 * Make a success action
 * 
 * If without config it replaces data when get success
 * or you can config with mergeData or mergeDeepData
 * to merge success data
 * @private
 * @param {String|Array} success
 * @returns {Object}
 */
export default function makeSuccessAction(success) {
  // get date function to prevent undefined and make sure all state will have data state
  const getData = action => action.payload || {}
  // success is array means it with customize behavior
  if(Array.isArray(success)) {
    const actionType = success[0]
    const options = success[1]
    // If mergeData is true default is null
    if (options.mergeData) {
      return {
        [actionType]: (state, action) => {
          return merge(state, {
            isLoading: false,
            data: merge(state.get('data'), getData(action)),
          })
        },
      }
    }
    // If mergeDeepData is true default is null
    else if (options.mergeDeepData) {
      return {
        [actionType]: (state, action) => {
          return merge(state, {
            isLoading: false,
            data: mergeDeep(state.get('data'), getData(action)),
          })
        },
      }
    }
  }
  // without config is default behavior
  return {
    [success]: (state, action) => {
      return merge(state, {
        isLoading: false,
        data: getData(action),
      })
    },
  }
}