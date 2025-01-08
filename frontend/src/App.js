import { ChakraProvider } from "@chakra-ui/react";
import UserList from "./UserList";

function App() {
  return (
    <ChakraProvider>
      <UserList />
    </ChakraProvider>
  );
}

export default App;