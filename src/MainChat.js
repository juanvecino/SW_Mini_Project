import React, { useEffect ,useState, useContext } from 'react';
import ChatBox from './ChatBox'; 
import './MainChat.css';
import UserContext from './UserContext';
import { getDatabase, ref, child, push, update, get, set, onValue, query, orderByValue, equalTo, orderByChild } from "firebase/database";
import SearchBar from './SearchBar'; // Import the SearchBar component

function getAllUsers() {
  const db = getDatabase();
  const usersRef = ref(db, 'persons'); // Adjust the reference path to your user data
  return new Promise((resolve, reject) => {
    const users = [];
    onValue(usersRef, (snapshot) => {
      snapshot.forEach((userSnapshot) => {
        const userData = userSnapshot.val();
        users.push({ id: userSnapshot.key, name: userData.name, surname: userData.surname });
      });
      resolve(users);
    }, (error) => {
      reject(error);
    });
  });
}

function sendMessage(senderId, senderName, roomId, text) {
  const db = getDatabase();
  const timestamp = Date.now();

  const messageData = {
    id_person: senderId,
    id_room: roomId,
    time: timestamp,
    text: text
  };

  const newMessageKey = push(child(ref(db), 'messages')).key;

  const updates = {};
  updates['/messages/' + newMessageKey] = messageData;
  updates['/chats/' + roomId + '/messageHistory/' + newMessageKey] = true;

  return update(ref(db), updates);
}

function createRoom(roomName, users_ids) {
  const db = getDatabase();

  // Generate a new ref for the room with a unique ID
  const roomRef = push(ref(db, 'rooms'));

  // Define the room object
  const roomData = {
    id_room: roomRef.key,
    id_list_people: users_ids,
    history_message: [],
    name: roomName
  };

  // Save the room object to the database
  set(roomRef, roomData)
    .then(() => {
      console.log("Room created successfully!");

      users_ids.forEach(userId => {
        const userRoomsRef = ref(db, `/persons/${userId}/id_rooms`);
        // Get current id_rooms list for the user
        get(userRoomsRef).then(snapshot => {
          const currentRooms = snapshot.val() || [];
          const updatedRooms = [...currentRooms, roomRef.key];
          // Update id_rooms list for the user
          update(userRoomsRef, updatedRooms);
        });
      });
    })
    .catch((error) => {
      console.error("Error creating room:", error);
    });
}

//createRoom("",['NW60PUGj8qXFImSgNbovEhM3H112','UXvWEK0gjjey8YQDwCR4vkiqX0T2'])

function getRoomsForPerson(personId) {
  const db = getDatabase();
  const roomsRef = ref(db, 'rooms');
  const roomQuery = query(roomsRef, orderByChild("id_list_people"));

  return new Promise((resolve, reject) => {
    const rooms = [];
    onValue(roomQuery, (snapshot) => {
      snapshot.forEach((roomSnapshot) => {
        const roomData = roomSnapshot.val();
        if (roomData.id_list_people && roomData.id_list_people.includes(personId)) {
          rooms.push({ id: roomData.id_room, name: roomData.name });
        }
      });
      resolve(rooms);
    }, (error) => {
      reject(error);
    });
  });
}

function getMessagesForRoom(roomId) {
  const db = getDatabase();
  const messagesRef = ref(db, 'messages');
  const messagesQuery = query(messagesRef, orderByChild("id_room"), equalTo(roomId));

  return new Promise((resolve, reject) => {
    const messages = [];
    onValue(messagesQuery, (snapshot) => {
      snapshot.forEach((messageSnapshot) => {
        const messageData = messageSnapshot.val();
        if (messageData.id_room === roomId) {
          messages.push(messageData);
        }
      });
      resolve(messages);
    }, (error) => {
      reject(error);
    });
  });
}



const MainChat = () => {
  const { user } = useContext(UserContext);

  const [activeContact, setActiveContact] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [recentContacts, setRecentContacts] = useState([]); // Initialize as empty array
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all registered users

  // Fetch all registered users when the component mounts
  useEffect(() => {
    if (user && user.id_person) {
      getRoomsForPerson(user.id_person)
        .then((rooms) => {
          setRecentContacts(rooms);
        })
        .catch((error) => {
          console.error('Error fetching rooms for person:', error);
        });

      // Fetch all registered users
      getAllUsers()
        .then((users) => {
          setAllUsers(users);
        })
        .catch((error) => {
          console.error('Error fetching all users:', error);
        });
    }
  }, [user]);


  const db = getDatabase();
  const userRef = ref(db, `persons/${user.id_person}`);

  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  const handleSearchUser = (searchText) => {
    if (user && user.id_person) {
      // You can implement the logic to search for users and start a chat here
      // For example, you can create a room with the searched user if they exist
      // Replace the example user ID with the actual user ID
      const filtered = recentContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredContacts(filtered);
      const searchedUserId = 'USER_ID_TO_BE_REPLACED';
      createRoom('', [user.id_person, searchedUserId])
        .then(() => {
          // Reload the recent contacts after creating the room
          getRoomsForPerson(user.id_person)
            .then((rooms) => {
              setRecentContacts(rooms);
            })
            .catch((error) => {
              console.error("Error fetching rooms for person:", error);
            });
        })
        .catch((error) => {
          console.error("Error creating room:", error);
        });
    }
  };

  const handleStartChat = (contact) => {
    setActiveContact(contact);
    getMessagesForRoom(contact.id)
      .then(messages => {
        setChatHistory({
          ...chatHistory,
          [contact.id]: messages,
        });
      })
      .catch(error => {
        console.error("Error fetching messages for room:", error);
      });
  };

  const handleSendMessage = (messageText) => {
    if (user && activeContact) {

      console.log("User ID:", user.id_person);
      console.log("User Name:", user.name);
      console.log("Active Contact ID:", activeContact.id);
      console.log("Message:", messageText);

      sendMessage(user.id_person, user.name, activeContact.id, messageText)
        .then(() => {
          const currentChatHistory = chatHistory[activeContact.id];
          const updatedChatHistory = [...currentChatHistory, { text: messageText, user: user.name }];
          setChatHistory({
            ...chatHistory,
            [activeContact.id]: updatedChatHistory,
          });
        })
        .catch(error => {
          console.error("Error sending message: ", error);
        });
    }
  };

  return (
    <div className="main-chat-container">
      <div className="chat-sidebar">
        <h2>{user ? `Welcome, ${user.name} ${user.surname}` : 'Recent Contacts'}</h2>
        <SearchBar onSearch={handleSearchUser} />
        <ul className="contact-list">
          {allUsers.map((user) => (
            <li key={user.id}>
              <button onClick={() => handleStartChat(user)}>{`${user.name} ${user.surname}`}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-panel">
        {activeContact ? (
          <ChatBox
            activeContact={activeContact}
            onSendMessage={(messageText) => handleSendMessage(messageText)}
            messages={chatHistory[activeContact.id] || []}
          />
        ) : (
          <div className="welcome-message">
            <p>Select a contact to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainChat;
