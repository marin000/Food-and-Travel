import { createClient } from 'contentful'

export function getClient(){
    return createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_KEY
      })
}