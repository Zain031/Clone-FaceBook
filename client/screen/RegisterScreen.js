import React, { useState } from 'react'
import { TextInput, View,Text, TouchableOpacity, Alert } from 'react-native'
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// const REGISTER = gql`  
// mutation Register($name: String, $username: String, $email: String, $password: String, $profileImgUrl: String) {
//   register(name: $name, username: $username, email: $email, password: $password, profileImgUrl: $profileImgUrl) {
//     _id
//     name
//     username
//     email
//     password
//     profileImgUrl
//   }
// }
// `


function RegisterScreen() {
  const navigate = useNavigation()
  const [name,setName] = useState("")
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassoword] = useState("")
  const [profileImgUrl,setProfileImgUrl] = useState("")  
  const [register]= useMutation(REGISTER )   
  
async function handleSubmit(){   
try {
    await register({variables:{
      name:name,
      username:username,
      email:email,
      password:password,
      profileImgUrl:profileImgUrl

    }
  })
  Alert.alert("Register Success")
  navigate.navigate("Login")
} catch (error) {
  console.log(error);
  Alert.alert(error.message)
  
}
 }
 
  return (
    <>
    <SafeAreaProvider>
    <View style={{marginTop:64}}>
      <Text style={{textAlign:"center", fontWeight:'bold',fontSize:40,color:"blue",marginBottom:10 }}>Facebook</Text>
    </View>
    <View>
     <TextInput style={styles.input} placeholder='Name' onChange={setName} value={name}/>     
     <TextInput style={styles.input} placeholder='UserName' onChange={setUsername} value={username}/>     
     <TextInput style={styles.input} placeholder='Email' onChange={setEmail} value={email}/>
     <TextInput style={styles.input} placeholder='Password' onChange={setPassoword} secureTextEntry={true}  value={password}/>
     <TextInput style={styles.input} placeholder='ImageUrl'onChange={setProfileImgUrl} value={profileImgUrl} />    
     <TouchableOpacity  onPress={handleSubmit} >
        <View style={styles.button}>
          <Text style={{color:"white"}}>Sign Up</Text>
        </View>
      </TouchableOpacity>
      <Text style={{textAlign:"center", marginTop:20, color:"blue"}}onPress={()=>navigate.navigate("Login")} >Already have an account ? </Text>
    </View> 
    </SafeAreaProvider>
    </>
  )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius:6,
      marginHorizontal:40
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        marginHorizontal:150,
        borderRadius:8,
        width:200,
        marginLeft:85
        

      }
  });


export default RegisterScreen

