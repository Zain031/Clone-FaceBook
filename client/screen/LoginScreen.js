import React, { useContext, useState } from 'react'
import { TextInput, View,Text, TouchableOpacity, Alert, } from 'react-native'
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import AuthContext from '../context/auth';


const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
  }
}

`

function LoginScreen() {
  const navigate = useNavigation()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const[handleLogin]=useMutation(LOGIN)
  const{setIsSignedIn} = useContext(AuthContext)

  async function handleSubmit(){
    try {
      const result = await handleLogin({
        variables:{
          email:email,
          password:password
        }
      })
      Alert.alert("Login Success")
      setIsSignedIn(true)
      await SecureStore.setItemAsync(
        "accessToken", 
        `Bearer ${result.data.login.accessToken}`
      )
      
      navigate.navigate("HomeScreen")
    } catch (error) {
      console.log(error);
      Alert.alert(err.message)      
    }
  }

 
  return (
    <>
    <View style={{marginTop:120}}>
      <Text style={{textAlign:"center", fontWeight:'bold',fontSize:40,color:"blue",marginBottom:10 }}>Facebook</Text>
    </View>
    <View>   
     <TextInput style={styles.input} placeholder='Email' onChange={setEmail} value={email} />
     <TextInput style={styles.input} placeholder='Password'onChangeText={setPassword} value={password} secureTextEntry={true}/>  
     <TouchableOpacity onPress={()=> (handleSubmit)}>
        <View style={styles.button}>
          <Text style={{color:"white"}}>Sign In</Text>
        </View>
      </TouchableOpacity>
      <Text style={{marginTop:10,marginLeft:170}}>or</Text>
      <Text style={{marginTop:10,marginLeft:110, color:"blue"}} onPress={()=>(navigate.navigate("Register"))}>Create New Account </Text>
    </View>
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


export default LoginScreen