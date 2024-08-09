'use client';

import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I'm J.A.R.V.I.S your personal assistant. How can I help you today?`,
    },
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: result.content },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      sx={{ backgroundColor: 'black' }} // Black background
    >
      <Stack
        direction="column"
        width={{ xs: '90%', sm: '80%', md: '600px' }} // Responsive width
        height={{ xs: '80vh', sm: '70vh', md: '700px' }} // Responsive height
        border='1px solid white' // Outer boundary in white
        borderRadius='16px' // Rounded edges
        p={2}
        spacing={3}
        sx={{
          backgroundColor: 'black', // Inner background also black
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          sx={{
            backgroundColor: 'black', // Black background for message area
            color: 'white',
            '&::-webkit-scrollbar': {
              width: '6px', // Adjust width for scrollbar
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '6px', // Round scrollbar thumb
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display='flex'
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              sx={{ marginBottom: '10px' }}
            >
              <Box
                sx={{
                  bgcolor: message.role === 'assistant' ? '#444' : '#007aff', // Different colors for assistant and user
                  color: 'white',
                  borderRadius: '16px', // Rounded edges for message bubbles
                  padding: '10px 15px',
                  maxWidth: '70%',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  fontSize: '16px',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack
          direction='row'
          spacing={2}
          sx={{ flexShrink: 0 }}
        >
          <TextField
            label='Message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d1d6',
                  borderRadius: '20px',
                },
                '&:hover fieldset': {
                  borderColor: '#d1d1d6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d1d1d6',
                },
              },
              input: {
                color: 'white',
              },
              label: {
                color: '#d1d1d6',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              backgroundImage: 'linear-gradient(45deg, #ff7e5f, #feb47b)', // Gradient background
              color: 'white',
              borderRadius: '20px',
              border: '2px solid white', // White border
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundImage: 'linear-gradient(45deg, #ff5e5f, #fcbf49)', // Darker gradient on hover
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
