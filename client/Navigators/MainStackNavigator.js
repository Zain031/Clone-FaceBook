import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screen/LoginScreen"
import RegisterScreen from "../screen/RegisterScreen"
import { useContext } from "react"
import AuthContext from "../context/auth"
import HomeScreen from "../screen/HomeScreen"
import Detail from "../screen/Detail"
const Stack = createNativeStackNavigator()


function MainStackNavigator() {
  const {isSignedIn} = useContext(AuthContext)
  return (
    <Stack.Navigator>
        {
          isSignedIn?(
          <>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{title:"HomeScreen"}}/>
        <Stack.Screen name='Detail' component={Detail} options={{title:"Ditail"}}/>
      

         
         </>
         ):(
          <>
        <Stack.Screen name="Register" component={RegisterScreen} options={{title:"Register"}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{title:"Login"}}/>
         </>
            
          )
        }            
  </Stack.Navigator>
  )
}

export default MainStackNavigator