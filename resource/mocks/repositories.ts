import { rest } from 'msw'
import mockRepositories from './mockRepositories'

const NO_QUERY_ERROR = {
  "message": "Validation Failed",
  "errors": [
    {
      "resource": "Search",
      "field": "q",
      "code": "missing"
    }
  ],
  "documentation_url": "https://docs.github.com/v3/search"
}

const BASE_URL = 'https://api.github.com/search/repositories'
const ONE_SECOND = 1000 //ms

const handlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    const queryString = req.url.searchParams.get('q')

    if (!queryString) {
      return res(
        ctx.status(422),
        ctx.json(NO_QUERY_ERROR)
      )
    }


    const ABOUT_TWO_SECONDS = Math.floor(Math.random() * ONE_SECOND + ONE_SECOND)
    return res(
      ctx.delay(ABOUT_TWO_SECONDS),
      ctx.json(mockRepositories)
    )
  })
]

export default handlers
