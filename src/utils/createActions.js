import { merge, mergeDeep, set } from 'immutable'
import _isArray from 'lodash/isArray'

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
function makeSuccessAction(success) {
  // get date function to prevent undefined error and make sure all state will have data state
  const getData = action => action.payload || {}
  // success is array means it with customize behavior
  if(_isArray(success)) {
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

/**
 * Make a request action
 * @param {String} request 
 */
function makeRequestAction(request) {
  return {
    [request]: state => set(state, 'isLoading', true),
  }
}

/**
 * Make a cancel action
 * Cancel action is not required in createFetchReducer so if the value is null
 * it'll return empty object.
 * @param {String|null} cancel
 */
function makeCancelAction(cancel) {
  const cancelState = !cancel ? {} : {
    [cancel]: state => set(state, 'isLoading', false),
  }
  return cancelState
}

/**
 * To check is vailded config
 * 
 * @private
 * @param {String} method 
 * @param {Object} arg Customized create reducer methods(get,post,patch,delete) scheme
 */
function checkConfig(method, { request, success, failure }) {
  if (!request) throw new Error(`${method} request type undefined.`)
  if (!success) throw new Error(`${method} success type undefined.`)
  if (!failure) throw new Error(`${method} failure type undefined.`)
}

/**
 * Create process to handle fetch get actions
 * 
 * @private
 * @param {Object|null} arg
 * @return {Object}
 */
function createGetAction(config) {
  if (!config) return {}
  const { take, request, success, cancel, failure } = config
  checkConfig('GET', { request, success, failure })
  return {
    [take]: state => merge(state, {
      error: false,
    }),
    ...makeRequestAction(request),
    ...makeSuccessAction(success),
    ...makeCancelAction(cancel),
    [failure]: (state, action) => merge(state, {
      isLoading: false,
      error: action.error,
      errorMsg: action.payload.message,
    }),
  }
}

/**
 * Create process to handle fetch post actions
 * 
 * @private
 * @param {Object} arg
 * @return {Object}
 */
function createPostAction(config) {
  if (!config) return {}
  const { take, request, success, cancel, failure } = config
  checkConfig('POST', { request, success, failure })
  return {
    [take]: state => merge(state, {
      error: false,
    }),
    ...makeRequestAction(request),
    ...makeSuccessAction(success),
    ...makeCancelAction(cancel),
    [failure]: (state, action) => merge(state, {
      isLoading: false,
      error: action.error,
      errorMsg: action.payload.message,
    }),
  }
}

/**
 * Create process to handle fetch patch actions
 * 
 * @private
 * @param {Object} arg
 * @return {Object}
 */
function createPatchAction(config) {
  if (!config) return {}
  const { take, request, success, cancel, failure } = config
  checkConfig('PATCH', { request, success, failure })
  return {
    [take]: state => merge(state, {
      error: false,
    }),
    ...makeRequestAction(request),
    ...makeSuccessAction(success),
    ...makeCancelAction(cancel),
    [failure]: (state, action) => merge(state, {
      isLoading: false,
      error: action.error,
      errorMsg: action.payload.message,
    }),
  }
}

/**
 * Create process to handle fetch delete actions
 * 
 * @private
 * @param {Object} arg
 * @return {Object}
 */
function createDeleteAction(config) {
  if (!config) return {}
  const { take, request, success, cancel, failure } = config
  checkConfig('DELETE', { request, success, failure })
  return {
    [take]: state => merge(state, {
      error: false,
    }),
    ...makeRequestAction(request),
    ...makeSuccessAction(success),
    ...makeCancelAction(cancel),
    [failure]: (state, action) => merge(state, {
      isLoading: false,
      error: action.error,
      errorMsg: action.payload.message,
    }),
  }
}

/**
 * Create process to handle all fetch actions
 * 
 * @private
 * @param {Object} arg
 * @return {Object}
 */
export default function createActions(arg) {
  return {
    get: createGetAction(arg.get),
    post: createPostAction(arg.post),
    patch: createPatchAction(arg.patch),
    delete: createDeleteAction(arg.delete),
  }
}
