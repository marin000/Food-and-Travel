import { getClient, getEntries } from "../utils/contentful";
import { Button } from 'primereact/button';

export async function getStaticProps() {
  
  const client = getClient()
  const result = getEntries(client, 'contact')
  return result
}

export default function Home({ result }) {
  console.log(result)
  return (
    <div>
      <Button label="Show"  />
    </div>
  )
}
