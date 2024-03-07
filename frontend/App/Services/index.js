import { request, gql } from 'graphql-request'

const MASTER_URL = "https://api-ap-south-1.hygraph.com/v2/clssu3wz602pz07w042x8w029/master"

export const getWritingList = async()=> {
    const query = gql`
    query WiteTaskList {
        writingTasks {
          word
          voice {
            url
          }
          answer
          image {
            url
          }
        }
      }
      
    `
    const result = await request(MASTER_URL, query)
    return result
}