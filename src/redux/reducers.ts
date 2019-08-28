import { combineReducers } from 'redux'
import history from '@/router/history';

interface action {
  type: string,
  [key: string]: any
}

// 路由跳转，必须使用settimeout，否则会在渲染的时候修改state导致警告
const to = (url: string) => {
  setTimeout(() => {
    history.push(url);
  }, 0);
}

const initialState = {
  url: '',
  article: {
    isFetching: false,
    list: []
  },
  articleType: {
    isFetching: false,
    list: []
  }
}

const url = (state = initialState.url, action: action) => {
  switch (action.type) {
    case "TO_ROUTER":
      // reducer应该保持纯净，不应该在此跳转，后续修改
      to(action.url);
      return action.url
    default:
      return state;
  }
}

const article = (state = initialState.article, action: action) => {
  switch (action.type) {
    case "REQUEST_ARTICLE":
      return {
        ...state, ...{
          isFetching: true,
        }
      }
    case "RECEIVE_ARTICLE":
      return {
        isFetching: false,
        list: action.res.data,
      }
    default:
      return state;
  }
}

const articleType = (state = initialState.articleType, action: action) => {
  switch (action.type) {
    case 'REQUEST_ARTICLE_TYPE':
      return {
        ...state,
        ...{ isFetching: true }
      }
    case 'RECEIVE_ARTICLE_TYPE':
      return {
        ...state,
        ...{
          isFetching: false,
          list: action.res.data
        }
      }
    default:
      return state;
  }
}

const app = combineReducers({
  url,
  article,
  articleType
})
export default app