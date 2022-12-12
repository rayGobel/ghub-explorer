import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import _debounce from 'lodash.debounce'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator';

const RepositoryListEmptyComponent = ({ className }) => {
  return (
    <div data-testid="repository-list__empty" className={className}>
      <p className="font-italic">No result found</p>
    </div>
  )
}

const RepositoryListComponent = (props) => {
  const { repositories = [], className } = props

  if (!repositories.length) {
    return (<RepositoryListEmptyComponent className={className} />)
  }

  return (
    <div className={`flex flex-column row-gap-3 ${className}`}>
      {
        repositories.map((repository) => {
          const {
            description,
            name,
            node_id,
            updated_at,
            svn_url,
            topics,
          } = repository

          return (
            <div key={node_id} className="repository-item flex flex-column row-gap-0">
              <a
                href={svn_url}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-700 font-semibold hover:underline">
                {name}
              </a>
              <p className="text-sm mb-0">{description}</p>
              <p className="text-xs m-0">Last Updated: {updated_at} </p>
              <div className="flex column-gap-1">
                <p className="text-xs font-semibold">topics: </p>
                {
                  topics.length
                   ? topics.map((topic) => {
                    return (
                      <p key={topic} className="text-xs font-italic">{topic}</p>
                    )
                  })
                  : <p className="text-xs">-</p>
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

function fetchQuery (queryString, page = 1) {
  const URL = `https://api.github.com/search/repositories?q=${queryString}&page=${page}`
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'text/html;charset=UTF-8',
    }
  }

  return fetch(URL, options).then(res => res.json())
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [beginSearch, setBeginSearch] = useState(false)

  // Pagination
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(30)

  const currentPage = first / 30 + 1;

  const {
    isLoading,
    isFetching,
    error,
    data: { total_count, items } = {}
  } = useQuery({
    queryKey: ['repositoryList', searchQuery, currentPage],
    queryFn: () => fetchQuery(searchQuery, currentPage),
    enabled: beginSearch,
  })

  useEffect(() => {
    if (isLoading == false && beginSearch) {
      setBeginSearch(false)
    }

  }, [isLoading, beginSearch])

  const handlePageChange = (e) => {
    setFirst(e.first)
    setRows(e.rows)
    setBeginSearch(true)
  }

  const handleQueryInput = (query) => {
    setSearchQuery(query)
  }

  const searchRepository = () => {
    setBeginSearch(true)
  }

  const showPaginator = items?.length > 0

  return (
    <div className="app-root">
      <Head>
        <title>Github Repository Explorer</title>
        <meta name="description" content="Github Repository Explorer" />
      </Head>

      <header
        className="px-4 py-2 border-bottom-1"
      >
        <h1
          className="text-base italic font-normal"
          style={{ color: 'var(--blue-600)' }}
        >
          GitHub Explore
        </h1>
      </header>

      <main className="flex flex-col justify-content-center w-full relative p-4">
        <Card className="px-8 w-10">
          <h1 className="text-2xl font-light">Search Github Repository</h1>

          <div className="p-inputgroup">
            <InputText
              placeholder="search term"
              value={searchQuery}
              onChange={(ev) => handleQueryInput(ev.target.value)}
            />
            <Button label="search" onClick={searchRepository} />
          </div>

          {
            isFetching && isLoading
              ? (
                <p>Fetching Data...</p>
              )
            : null
          }

          {
            !isLoading
              ? (
                <RepositoryListComponent className="mt-5" repositories={items} />
              )
            : null
          }

          {
            showPaginator
            ? (
              <Paginator
                rows={rows}
                first={first}
                totalRecords={total_count}
                onPageChange={handlePageChange}
              />
            )
            : null
          }
        </Card>
      </main>

      <footer className="px-4 py-1 text-sm font-italic">
        <p>github repo explorer - 2022</p>
      </footer>

    </div>
  )
}

const queryClient = new QueryClient()

export default function HomeWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
