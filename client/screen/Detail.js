import { gql } from '@apollo/client'
import React from 'react'

function Detail({navigation,route}) {
 const GET_DETAIL =gql`
 query GetPostById($id: ID!) {
  getPostById(_id: $id) {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      _id
      name
      username
      email
      password
      profileImgUrl
    }
    comments {
      content
      username
      profileImgUrl
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}

 `
 

  return (
    <div>Detail</div>
  )
}

export default Detail