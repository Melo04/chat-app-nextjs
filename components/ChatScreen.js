import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFile from "@mui/icons-material/AttachFile";
import { Avatar, IconButton } from "@material-ui/core";
import Message from './Message';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import firebase from "firebase/compat/app";
import {
  collection,
  doc,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  setDoc,
  where,
  deleteDoc
} from "firebase/firestore";
import { useState, useRef } from 'react';
import getRecipientEmail from '@/utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const endOfMessageRef = useRef(null)
    const messagesQuery = query(
      collection(doc(db, "chats", router.query.id), "messages"),
      orderBy("timestamp", "asc")
    );
    const [messagesSnapshot] = useCollection(messagesQuery);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [recipientSnapshot] = useCollection(
      query(
        collection(db, "users"),
        where("email", "==", getRecipientEmail(chat.users, user))
      )
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    };

    const ScrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();

        setDoc(
          doc(db, "users", user.uid),
          {
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        addDoc(collection(db, "chats", router.query.id, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        ScrollToBottom();
    }

    const handleDeleteConversation = async () => {
        const chatRef = doc(db, "chats", router.query.id);
        await deleteDoc(chatRef);
        router.push("/");
        setIsDialogOpen(false);
    };

    const recipient = recipientSnapshot?.docs[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
      <Container>
        <Header>
          {recipient ? (
            <Avatar src={recipient?.photoURL} />
          ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}
          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>
                Last active:{" "}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </p>
            ) : (
              <p>Loading Last Active...</p>
            )}
          </HeaderInformation>
          <HeaderIcons>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton onClick={() => setIsDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </HeaderIcons>
        </Header>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle style={{ color: "red", fontSize: "20px" }}>
            Are you sure you want to delete this conversation?
          </DialogTitle>
          <DialogContent>
            <Typography>Alert: This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConversation}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessageRef} />
        </MessageContainer>

        <InputContainer>
          <InsertEmoticon />
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
          <MicIcon />
        </InputContainer>
      </Container>
    );
}

const Container = styled.div``;

const Input = styled.input`
flex: 1;
align-items: center;
padding: 20px;
position: sticky;
bottom: 0;
background-color: whitesmoke;
border: none;
outline: 0;
border-radius: 10px;
margin-left: 15px;
margin-right: 15px;
`

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #dcf8c6;
  z-index: 100;
`;

const Header = styled.div`
position: sticky;
background-color: white;
z-index: 100;
top: 0;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;
> h3{
    margin-bottom: 3px;
}

> p{
    font-size: 14px;
    color: gray;
}
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
  background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-repeat: no-repeat;
  background-size: cover;
  padding: 30px;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
margin-bottom: 50px;
`