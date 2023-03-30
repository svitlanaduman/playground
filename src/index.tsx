import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client'
import './style.css'

import { from, HttpLink } from '@apollo/client'
import { Laika } from '@zendesk/laika/esm/laika'


type MissionsType = {
  launchesPast: Array<{
    mission_name: string,
    launch_site: { site_name_long: string }
  }>
}

const LIST_MISSIONS = gql`
  query ListMissions {
    launchesPast(limit: 2) {
      mission_name
      launch_site {
        site_name_long
      }
    }
  }
`

const laika = new Laika()

const link = from([
  laika.createLink(),
  new HttpLink({ uri: 'https://api.spacex.land/graphql' }),
])

const interceptor = laika.intercept({
  operationName: 'ListMissions',
})



// below, we're mocking the result once
// which means that once you press "refetch"
// we'll passthrough the request to the actual HttpLink
interceptor.mockResultOnce({
  result: {
    data: {
      launchesPast: [
        {
          mission_name: 'Sputnik 2',
          launch_site: { site_name_long: 'Baikonur 1/5' },
        },
        {
          mission_name: 'Mock mission',
          launch_site: { site_name_long: 'Mock launch site' },
        },
      ],
    },
  },
})



const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

function Missions() {
  const { data, loading, error, refetch } = useQuery<MissionsType>(
    LIST_MISSIONS,
    {
      client,
    },
  )

  if (!data || loading || error) {
    return <p>{error ? error.message : 'Loading...'}</p>
  }

  return (
    <>
      <ul>
        {data.launchesPast.map((launch) => (
          <li key={launch.mission_name}>
            {launch.mission_name} at {launch.launch_site.site_name_long}
          </li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Refetch</button>
    </>
  )
}

ReactDOM.render(<Missions />, document.getElementById('root'))


