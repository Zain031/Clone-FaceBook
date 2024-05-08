import { gql, useQuery } from "@apollo/client";


const GET_POST = gql`
  query Posts {
    locations {
      id
      content
      imgUrl
      authorId
      comments
     likes

    }
  }
`;


import React from 'react'




function Card() {
    const { loading, error, data } = useQuery(GET_POST);
  return (
    
<></>

  
  )
}

export default Card