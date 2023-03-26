import { Button } from "@material-ui/core";
import styled from "styled-components"
import Head from "next/head";
import {auth, provider} from "../firebase";
import {signInWithPopup} from "firebase/auth";
import { Google } from "@mui/icons-material";

export default function Login() {
    const signIn = () => {
        signInWithPopup(auth, provider)
    }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/640px-WhatsApp.svg.png" />
        <StyledButton onClick={signIn}>
          <LogoImage
            src="https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png"
            alt="Google Logo"
          />
          Sign in with google
        </StyledButton>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color: #000;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(255, 255, 255, 0.7);
  transform-style: preserve-3d;
  transform: translateZ(-50px);
  perspective: 1000px;
  backface-visibility: hidden;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #a8ff9b;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 200px;
  text-transform: none;
  box-shadow: 0px 4px 14px -3px rgba(63, 81, 181, 0.7);
  transform-style: preserve-3d;
  transform: translateZ(50px);
  perspective: 1000px;
  backface-visibility: hidden;
  color: #fff;

  &:hover {
    background-color: #4285f4;
    color: #4285f4;
    box-shadow: 0px 4px 14px -3px rgba(66, 133, 244, 0.7);
  }
`;

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  transform-style: preserve-3d;
  transform: translateZ(20px);
  perspective: 1000px;
  backface-visibility: hidden;
`;

const ButtonText = styled.span`
  margin-right: 10px;
`;