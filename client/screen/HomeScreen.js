import React from 'react'
import { gql, useQuery } from "@apollo/client";
import { View } from 'react-native';

const GET_POST = gql`
query Posts {
  posts {
    _id
    authorId
    comments {
      content
      username
      profileImgUrl
      createdAt
      updatedAt
    }
    content
    createdAt
    imgUrl
    likes {
      username
      createdAt
      updatedAt
    }
    tags
    updatedAt
  }
}
`;
function HomeScreen({}) {

const {loading, error, data} = useQuery(GET_POST)
if(loading){
  return (
    <View>
      <Text style={{alignItems:'center',justifyContent:'center'}}>Loading</Text>
    </View>
  )
}

if(error){
  return (
    <View style={{justifyContent:'center', alignItems:'center'}}>
      <Text>Something wrong</Text>
    </View>
  )
}

return(
    <View style={{flex:1}}>
        <FlatList
        data={data.posts}

        
           
        />
    </View>
)
}


export default HomeScreen