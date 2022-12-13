# GITHUB REPO EXPLORER - WITH NEXT.JS

## Getting Started

First, copy the environment variable

```sh
cp .env.example .env.local
```

then, run the development server:

```bash
yarn dev
```

this will integrate github API without authentication. Github API will have
rate limiting if used without authentication. See: [github search - rate limit](https://docs.github.com/en/rest/rate-limit?apiVersion=2022-11-28#about-rate-limits)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

To enable MSW mocking, please set the `NEXT_PUBLIC_ENABLE_MSW` flag to true on `.env.local`

```sh
vim .env.local
```

set flag

```env
NEXT_PUBLIC_ENABLE_MSW=true
```

this will mock github search and ignore rate limit of Github API
