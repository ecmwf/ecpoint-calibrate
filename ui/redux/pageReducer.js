const defaultState = {
  page: 0
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PAGE.SET_PAGE': {
      return { ...state, page: action.data }
    }

    default: {
      return state
    }
  }
}
