import { useState } from "react";
import { ChatContainer, MainContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './App.css'


const customStyle = {
  position : "relative",
  width : "500px",
  height : "500px"
}

const msgInitialState = {
  message : 'Hello !',
  sender : 'user',
  sentTime : new Date().toLocaleDateString()
}

const ak = "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"

function App() {
  const [messages, setMessages] = useState([msgInitialState]);
  const [typing, setTyping] = useState(false);

  const handleUserInput = async(msg) => {
    const newMsg = {
      msg,
      sender : 'user',
      sentTime : new Date().toLocaleDateString(),
      direction : 'outgoing'
    }

    const newMsgs = [...messages, newMsg];
    setMessages(newMsgs);
    setTyping(true);

    await processMessageFromUser(newMsgs);
  }

  const processMessageFromUser = async(chatMsgs) => {
    let apiMsgs = chatMsgs.map((objMsg) => {
      let role = ""
      if(objMsg.sender == 'ChatGPT'){
        role = 'assistant'
      } else {
        role = 'user'
      }
      return {
        role : role,
        content : objMsg.message
      }
    })

    const systemMsg = {
      role : "system",
      content : "Just make very concise and short messages."
    }

    const bodyRequest = {
      model : "gpt-3.5-turbo",
      messages : [systemMsg,...apiMsgs]
    }


    await fetch('https://api.openai.com/v1/chat/completions', {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${ak}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(bodyRequest)
    }).then(res => res.json())
      .then(console.log)

  }


  return (
    <>
    <div style={customStyle} >
      <MainContainer>
        <ChatContainer>
          <MessageList
          typingIndicator={typing ? <TypingIndicator content="Thinking..." /> : null}
          >
            {messages.map((msg,i) => {
              return <Message key={i} model={msg} />
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleUserInput} />
        </ChatContainer>
      </MainContainer>
    </div>
      
    </>
  )
}

export default App
