import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import Fuse from "fuse.js";
import { useState } from "react";

export default function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = query(
      collection(db, "chats"),
      where("users", "array-contains", user.email)
    );
    const [chatsSnapshot] = useCollection(userChatRef);
    const [searchQuery, setSearchQuery] = useState("");

    const [showPrompt, setShowPrompt] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");

    const handleRecipientEmailChange = (e) => {
        setRecipientEmail(e.target.value);
    };

    const handlePromptClose = () => {
        setShowPrompt(false);
        setRecipientEmail("");
    };

    const handlePromptSubmit = () => {
        if (
        EmailValidator.validate(recipientEmail) &&
        !chatAlreadyExists(recipientEmail) &&
        recipientEmail !== user.email
        ) {
        addDoc(collection(db, "chats"), {
            users: [user.email, recipientEmail],
        });
        handlePromptClose();
      }
    }

    const chatAlreadyExists = (recipientEmail) => {
        return !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );
    }

    const fuse = new Fuse(chatsSnapshot?.docs || [], {
      keys: ["users"],
    });

    const handleSearchInput = (e) => {
      setSearchQuery(e.target.value);
    };

    const filteredChats = chatsSnapshot?.docs.filter((doc) => {
      const users = doc.data().users;
      if (searchQuery.trim() === "") {
        return true;
      }
      return users.some((user) =>
        user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput
          placeholder="Search in chats"
          value={searchQuery}
          onChange={handleSearchInput}
        />
      </Search>

      <SidebarButton onClick={() => setShowPrompt(true)}>Start a new chat</SidebarButton>
      {showPrompt && (
        <PromptBox>
          <PromptLabel>Enter email address you want to chat with:</PromptLabel>
          <PromptInput
            type="email"
            value={recipientEmail}
            onChange={handleRecipientEmailChange}
          />
          <div>
            <PromptButton onClick={handlePromptSubmit}>Submit</PromptButton>
            <PromptButton onClick={handlePromptClose}>Cancel</PromptButton>
          </div>
        </PromptBox>
      )}

      {searchQuery.length > 0 ? filteredChats.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      )) :
      chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
display: flex;
align-items: center;
padding: 20px;
border-radius: 2px;
`;

const SidebarButton = styled.button`
  width: 90%;
  background-color: #25d366;
  color: white;
  cursor: pointer;
  padding-left: 15px;
  padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
  font-size: 18px;

  &&& {
    border: none;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  &:hover {
    background-color: #128c7e; /* change background color on hover */
  }
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease-in-out;
`;

const SearchInput = styled.input`
outline-width: 0;
border: none;
flex: 1;
`;

const Header = styled.div`
display: flex;
position: sticky;
top: 0;
background-color: white;
z-index: 1;
justify-content: space-between;
align-items: center;
padding: 15px;
height: 80px;
border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
cursor: pointer;
:hover {
    opacity: 0.8;
}
`;

const IconsContainer = styled.div``;

const PromptBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 50px;
  transform: translate(-50%, -50%);
  background-color: #dcf8c6;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 9999;
`;

const PromptLabel = styled.label`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
  display: block;
`;

const PromptInput = styled.input`
  width: 100%;
  border-radius: 5px;
  border: none;
  padding: 10px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
  }
`;

const PromptButton = styled.button`
  background-color: #128c7e;
  color: #fff;
  border: none;
  width: 30%;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 15px;

  &:hover {
    background-color: #2e8b57;
  }
`;