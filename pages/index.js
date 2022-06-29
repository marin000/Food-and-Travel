import { getClient, getEntries } from "../utils/contentful"

export async function getStaticProps() {
  
  const client = getClient()
  const result = getEntries(client, 'contact')
  return result
}

export default function Home({ result }) {
  console.log(result)
  return (
    <div>
      
    </div>
  )
}
