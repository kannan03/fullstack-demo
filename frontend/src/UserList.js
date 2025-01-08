import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  // const [localUsers, setLocalUsers] = useState([]);
  
  // State for the Add User form fields
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    company: { name : ""},
    role: "",
    address: { country : ""}
  });

  const [isAdd, setIsAdd] = useState(false);
  const [ errorMsg, setErrorMsg] = useState('');

  const viewAddForm = ()=>{
    setNewUser({
      firstName: "",
      lastName: "",
      company: { name : ""},
      role: "",
      address: { country : ""}
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsAdd(!isAdd);
  }

  // Fetch users from the API
  useEffect(() => {
    axios.get("https://dummyjson.com/users")
      .then(response => setUsers(response.data.users))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    axios.get("https://dummyjson.com/users")
      .then(response => setUsers(response.data.users))
      .catch(error => console.error("Error refreshing users:", error));
  };

  // Handle form change for the new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if( name === "country"){
      setNewUser(prevState => ({
        ...prevState,
        address : { country : value}
      }));
    }else if( name === "company"){
      setNewUser(prevState => ({
        ...prevState,
        company : { name : value}
      }));
    }else{
      setNewUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const [ successMsg, setSuccessMsg] = useState("")

  // Handle add new user
  const handleAddUser = () => {
    setErrorMsg("");
    setSuccessMsg("")
    if (!newUser.firstName || !newUser.lastName || !newUser.role ) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    const userToAdd = {
      id: Date.now(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      company: { name: newUser?.company?.name },
      role: newUser.role,
      address: { country : newUser?.address?.country },
    };
    setUsers(prevState => [userToAdd, ...prevState]);

    // Clear form after adding the user
    setNewUser({
      firstName: "",
      lastName: "",
      company: { name : ""},
      role: "",
      address: { country : ""}
    });

    setSuccessMsg("User add successful")
    setTimeout(()=>{
      setIsAdd(false);
      setSuccessMsg("");
    }, 2000)

  };

  // Handle delete user
  const handleDeleteUser = (id) => {
    setUsers(prevState => prevState.filter(user => user.id !== id));
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>{
    return ( user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    user.company.name.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase()) ||
    user.address.country.toLowerCase().includes(search.toLowerCase())
  )
    

  }
  );

  return (
    <Box p={4}>
      <Stack direction="row" spacing={4} mb={4}>
        <Input
          placeholder="Search by name, company, role, or country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleRefresh} colorScheme="teal">
          Refresh List
        </Button>
        <Button onClick={viewAddForm} colorScheme="blue">
          + Add User
        </Button>
      </Stack>

      {
        isAdd &&   <Box p={4} mb={4} borderWidth="1px" borderRadius="md">
        <Text fontSize="lg" mb={2}>Add a New User</Text>
         { errorMsg && <Text mb={2} bgColor={'red'}>{errorMsg}</Text> }
         { successMsg && <Text mb={2} bgColor={'green'}>{successMsg}</Text> }
        <Stack spacing={3}>
          <Input
            placeholder="First Name"
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Last Name"
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Company"
            name="company"
            value={newUser.company.name}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Role"
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Country"
            name="country"
            value={newUser.address.country}
            onChange={handleInputChange}
          />
          <Button onClick={handleAddUser} colorScheme="blue">
            Add User
          </Button>
        </Stack>
      </Box>
      }
      {/* Display filtered users */}
      {filteredUsers.length > 0 ? (
        <Stack spacing={3}>
          {filteredUsers.map(user => (
            <Box key={user.id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">{`${user.firstName} ${user.lastName}`}</Text>
              <Text>Company: {user.company.name}</Text>
              <Text>Role: {user.role}</Text>
              <Text>Country: {user.address.country}</Text>
              <Button onClick={() => handleDeleteUser(user.id)} colorScheme="red" mt={2}>
                Delete
              </Button>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>No users found.</Text>
      )}
    </Box>
  );
};

export default UserList;
