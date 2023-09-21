# WebChat

Firebase and Native-based web chat application that allows registered users to chat with each other in real time.
Project Partners: Bora Bulut and Juan Vecino
The work was split equally. Bora worked mostly on front-end, and Juan mostly worked on back-end.

### Demo Video

Click the link to watch the app in action: https://drive.google.com/file/d/16yi_vNt7pEYtUe4EwQp6X-XHKcI0iYij/view?usp=share_link

### Login Page

The login page has a simple UI that greets the user with a welcome text at top center. Right below it, there is a Google authentication button that allows the user sign in with their Google account. This is the only sign in method.
![Screenshot 2023-09-20 at 19 40 48](https://github.com/juanvecino/SW_Mini_Project/assets/91101241/7724ddfb-e63b-4d83-a877-0173e67c88ac)

### Main Chat Page

Once the user is logged in, they are taken to the main chat page where there is a search bar on the upper left hand side, which the user can use to search for other users by their name, last name, or email. The left column is dedicated to active chats. The user can conveniently pick from the list to chat with the person of interest.
![Screenshot 2023-09-20 at 20 01 15](https://github.com/juanvecino/SW_Mini_Project/assets/91101241/c306c9ef-cd52-4d67-a652-302f11ef6c5c)
![Screenshot 2023-09-20 at 20 01 49](https://github.com/juanvecino/SW_Mini_Project/assets/91101241/a4a5cd99-e43f-4676-a760-bf7aec368170)

### Chat Box

After the users pick the person they want to start conversation with, the chat section on the right side gets activated and shows the name of the person that's being chat with. When the user types their message and presses send, the text is displayed on the right with the name and last name of the sender, date, and time right above it. Received messages are shown in the same format but on the left side.
![Screenshot 2023-09-20 at 20 02 11](https://github.com/juanvecino/SW_Mini_Project/assets/91101241/b63fed1a-aec8-4f3d-b71e-d90fa94f06b8)
<img width="1792" alt="Screenshot 2023-09-21 at 11 03 45" src="https://github.com/juanvecino/SW_Mini_Project/assets/49287699/daf41866-3477-4231-857c-b7a8ace83f6d">

### DataBase

Inside the database, we have made the following collections:

<img width="1787" alt="Screenshot 2023-09-21 at 11 28 50" src="https://github.com/juanvecino/SW_Mini_Project/assets/49287699/769ede16-faee-447c-92c8-be0244f679e8">

Persons:
  - email: jvecino@bu.edu
  - id_person: "OpErlvwSP5Qwww22PFDAITHzDWP2"
  - id_rooms: "List of rooms they are in"
  - name: Juan
  - surname: Vecino

Messages:
  - id: "Id of the message"
  - receiverId :"NW60PUGj8qXFImSgNbovEhM3H112"
  - senderId : "OpErlvwSP5Qwww22PFDAITHzDWP2"
  - text : "Hi"
  - time : 1695309088985
  - user : "Bora Bulut"

So how it works is when you go to the searchBar and click on a user it automatically creates a room with the id of the people. Doing this can help us create groups of people for the future.

Also all of the database is realtime, so every message will be received instantly.

### Authentication

<img width="1791" alt="Screenshot 2023-09-21 at 11 29 55" src="https://github.com/juanvecino/SW_Mini_Project/assets/49287699/1707c2a9-74bc-4ffd-85c0-e226eb8a6420">

Here we can see all the people who have signed up for our service. By using Google and not doing our own login, we have saved time and make it more secure.

