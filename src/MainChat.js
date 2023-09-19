import React, { useEffect, useState, useContext } from 'react';
import ChatBox from './ChatBox';
import './MainChat.css';
import UserContext from './UserContext';
import { getDatabase, ref, push, get, onValue, set  } from "firebase/database";

function sendMessage(senderId, receiverId, text, senderName, senderSurname) {
  const db = getDatabase();
  const timestamp = Date.now();

  const messageData = {
    senderId: senderId,
    receiverId: receiverId,
    time: timestamp,
    text: text,
    user: `${senderName} ${senderSurname}`
  };

  const newMessageKey = push(ref(db, 'messages')).key;
  return set(ref(db, `/messages/${newMessageKey}`), messageData);
}

function getContactsForPerson(personId) {
  const db = getDatabase();
  const userRef = ref(db, `persons/${personId}/id_rooms`);

  return get(userRef)
  .then(snapshot => {
    if (snapshot.exists()) {
      const contactIds = snapshot.val();
      const contactPromises = Array.isArray(contactIds) 
        ? contactIds.map(id => get(ref(db, `persons/${id}`)))
        : Object.values(contactIds).map(id => get(ref(db, `persons/${id}`)));
      
      return Promise.all(contactPromises);
    } else {
      return [];
    }
  })
  .then(contactSnapshots => {
    return contactSnapshots.map(snapshot => snapshot.val());
  })
  .catch(error => {
    console.error("Error fetching id_rooms:", error);
    throw error;
  });
}




function addContact(userId, contactId) {
  const db = getDatabase();

  const addUserToContact = ref(db, `persons/${userId}/id_rooms`);
  const addContactToUser = ref(db, `persons/${contactId}/id_rooms`);

  return get(addUserToContact).then(snapshot => {
    const currentContacts = snapshot.val() || [];
    if (!currentContacts.includes(contactId)) {
      currentContacts.push(contactId);
    }
    set(addUserToContact, currentContacts);
  })
  .then(() => {
    return get(addContactToUser);
  })
  .then(snapshot => {
    const currentContacts = snapshot.val() || [];
    if (!currentContacts.includes(userId)) {
      currentContacts.push(userId);
    }
    set(addContactToUser, currentContacts);
  });
}

function getMessagesBetweenUsers(userId1, userId2) {
  const db = getDatabase();
  const messagesRef = ref(db, 'messages');

  return get(messagesRef).then(snapshot => {
    const messages = [];
    snapshot.forEach(messageSnapshot => {
      const messageData = messageSnapshot.val();
      if ((messageData.senderId === userId1 && messageData.receiverId === userId2) ||
          (messageData.senderId === userId2 && messageData.receiverId === userId1)) {
        messages.push(messageData);
      }
    });
    console.log("Fetched messages:", messages);
    return messages;
  });
}


const MainChat = () => {
  const { user } = useContext(UserContext);
  const [activeContact, setActiveContact] = useState(null);
  const [ chatHistory, setChatHistory] = useState({});
  const [contacts, setContacts] = useState([]);
  const [newContactId, setNewContactId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  

  useEffect(() => {
    if (user && user.id_person) {
      getContactsForPerson(user.id_person)
        .then(ids => {
          setContacts(ids);
        })
        .catch(error => {
          console.error("Error fetching contacts for person:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Si hay un contacto activo, establece un intervalo para buscar mensajes
    if (activeContact) {
      const intervalId = setInterval(() => {
        getMessagesBetweenUsers(user.id_person, activeContact.id_person)
          .then(messages => {
            // Guarda los mensajes en una variable local
            const fetchedMessages = messages;
            setChatHistory(prevState => ({
              ...prevState,
              [activeContact.id_person]: fetchedMessages
            }));
          })
          .catch(error => {
            console.error("Error fetching messages:", error);
          });
      }, 1000);

      // Limpia el intervalo cuando el componente se desmonte o el activeContact cambie
      return () => clearInterval(intervalId);
    }
  }, [activeContact,user]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setNewContactId(query);

    if(query.length === 0) {
      setIsDropdownVisible(false);
      return;
    }
  
    // Simplificando: buscamos en los contactos que ya hemos cargado.
    // Idealmente, esta búsqueda se haría en el servidor.
    const filteredContacts = contacts.filter(contact =>
      `${contact.name} ${contact.surname}`.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
    );
  
    setSearchResults(filteredContacts);
    setIsDropdownVisible(true);
  };
  

  const handleAddContact = () => {
    if (newContactId && user && user.id_person !== newContactId) {
      addContact(user.id_person, newContactId)
        .then(() => {
          console.log("Contact added successfully!");
          return getContactsForPerson(user.id_person);
        })
        .then(contactDetails => {
          setContacts(contactDetails);
        })
        .catch(error => {
          console.error("Error adding contact:", error);
        });
      setNewContactId('');
    }
  };
  
  const handleAddContactByObject = (contact) => {
    if (user && user.id_person !== contact.id_person) {
      addContact(user.id_person, contact.id_person)
        .then(() => {
          console.log("Contact added successfully!");
          return getContactsForPerson(user.id_person);
        })
        .then(contactDetails => {
          setContacts(contactDetails);
        })
        .catch(error => {
          console.error("Error adding contact:", error);
        });
    }
  };
  


  const handleStartChat = (contact) => {
    setActiveContact(contact);
    getMessagesBetweenUsers(user.id_person, contact.id_person)
      .then(messages => {
        console.log("HOLAA",messages);
        // Guarda los mensajes en una variable local
        const fetchedMessages = messages;
        setChatHistory(prevState => ({
          ...prevState,
          [contact.id_person]: fetchedMessages
        }));
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  };
  


  const handleSendMessage = (messageText) => {
    if (user && activeContact) {
      sendMessage(user.id_person, activeContact.id_person, messageText, user.name, user.surname)
        .then(() => {
          setChatHistory(prevChatHistory => {
            const currentChatHistory = [...(prevChatHistory[activeContact.id_person] || [])];
            const updatedMessage = {
              text: messageText, 
              user: `${user.name} ${user.surname}`, 
              userId: user.id_person, 
              time: Date.now()
            };
            currentChatHistory.push(updatedMessage);
            return {
              ...prevChatHistory,
              [activeContact.id_person]: currentChatHistory,
            };
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
        <h2>{user ? `Welcome, ${user.name} ${user.surname}` : 'Contacts'}</h2>
        <div className="add-contact">
          <input 
            type="text" 
            placeholder="Search by Name, Surname, or Email" 
            value={newContactId}
            onChange={handleSearchChange}
          />
          {isDropdownVisible && (
            <ul className="search-dropdown">
              {searchResults.map((contact, index) => (
                <li key={index} onClick={() => {
                  handleAddContactByObject(contact);
                  setNewContactId('');
                  setIsDropdownVisible(false);
                }}>
                  {contact.name} {contact.surname} ({contact.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="contact-list">
          {contacts.map((contact, index) => (
            <li key={index}>
              <button onClick={() => handleStartChat(contact)}>{contact.name} {contact.surname}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-panel">
        {activeContact ? (
          <ChatBox
            activeContact={activeContact}
            onSendMessage={(messageText) => handleSendMessage(messageText)}
            messages={chatHistory[activeContact.id_person] || []}
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
