import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Chip,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { getMessages } from '../services/api';

// Generate avatar colors based on name (reusing from HomePage)
const getAvatarColor = (name) => {
  if (!name) return 0;
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % 5;
};

// Get initials from name (reusing from HomePage)
const getInitials = (name) => {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

// Gradient colors for avatars
const gradientColors = [
  'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', // Blue
  'linear-gradient(135deg, #16a085 0%, #27ae60 100%)', // Green
  'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', // Red
  'linear-gradient(135deg, #f39c12 0%, #d35400 100%)', // Orange
  'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', // Purple
];

const MessagesPage = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Mock conversations data - in a real app, this would come from the API
  const mockConversations = [
    {
      id: '1',
      recipients: [
        { emp_id: '101', name: 'Alex Johnson', role: 'Frontend Developer' },
        { emp_id: '102', name: 'Sarah Miller', role: 'UX Designer' },
      ],
      roleOffered: 'React Developer',
      lastMessage: 'Yes, I would be interested in joining the project.',
      timestamp: '2025-04-24T14:30:00',
      unread: true,
      messages: [
        {
          id: '1-1',
          sender: 'admin',
          content: 'There is a role React Developer - are you willing to join the project?',
          timestamp: '2025-04-24T10:15:00'
        },
        {
          id: '1-2',
          sender: { emp_id: '101', name: 'Alex Johnson' },
          content: 'Yes, I would be interested in joining the project.',
          timestamp: '2025-04-24T14:30:00'
        }
      ]
    },
    {
      id: '2',
      recipients: [
        { emp_id: '103', name: 'David Wilson', role: 'Backend Developer' },
      ],
      roleOffered: 'Node.js Developer',
      lastMessage: 'Could you provide more details about the project timeline?',
      timestamp: '2025-04-23T16:45:00',
      unread: false,
      messages: [
        {
          id: '2-1',
          sender: 'admin',
          content: 'There is a role Node.js Developer - are you willing to join the project?',
          timestamp: '2025-04-23T11:30:00'
        },
        {
          id: '2-2',
          sender: { emp_id: '103', name: 'David Wilson' },
          content: 'Could you provide more details about the project timeline?',
          timestamp: '2025-04-23T16:45:00'
        }
      ]
    },
    {
      id: '3',
      recipients: [
        { emp_id: '104', name: 'Emily Brown', role: 'Project Manager' },
        { emp_id: '105', name: 'Michael Davis', role: 'Business Analyst' },
        { emp_id: '106', name: 'Jennifer Garcia', role: 'QA Engineer' },
      ],
      roleOffered: 'Agile Coach',
      lastMessage: 'I have experience with Scrum and Kanban methodologies.',
      timestamp: '2025-04-22T09:20:00',
      unread: false,
      messages: [
        {
          id: '3-1',
          sender: 'admin',
          content: 'There is a role Agile Coach - are you willing to join the project?',
          timestamp: '2025-04-21T15:10:00'
        },
        {
          id: '3-2',
          sender: { emp_id: '104', name: 'Emily Brown' },
          content: 'I have experience with Scrum and Kanban methodologies.',
          timestamp: '2025-04-22T09:20:00'
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // In a real application, we would fetch messages from the API
        // const data = await getMessages();
        // setMessages(data);
        
        // Using mock data for now
        setTimeout(() => {
          setMessages(mockConversations);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch messages. Please try again later.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSendingMessage(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      const updatedMessages = messages.map(conversation => {
        if (conversation.id === selectedConversation.id) {
          const newMessageObj = {
            id: `${conversation.id}-${conversation.messages.length + 1}`,
            sender: 'admin',
            content: newMessage,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...conversation,
            lastMessage: newMessage,
            timestamp: new Date().toISOString(),
            messages: [...conversation.messages, newMessageObj]
          };
        }
        return conversation;
      });
      
      setMessages(updatedMessages);
      setNewMessage('');
      setSendingMessage(false);
      
      // Update the selected conversation
      const updated = updatedMessages.find(c => c.id === selectedConversation.id);
      setSelectedConversation(updated);
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if the date is yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, return the date
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600">
          Messages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage conversations with staff members
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              height: '70vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6">Conversations</Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress size={40} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <EmailIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1">No messages yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  When you send messages to staff, they will appear here
                </Typography>
              </Box>
            ) : (
              <List sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
                {messages.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      px: 2,
                      py: 1.5
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="secondary"
                        variant="dot"
                        invisible={!conversation.unread}
                      >
                        <Avatar
                          sx={{
                            background: gradientColors[getAvatarColor(conversation.recipients[0].name)],
                          }}
                        >
                          {getInitials(conversation.recipients[0].name)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: '80%', fontWeight: conversation.unread ? 600 : 400 }}>
                            {conversation.recipients.map(r => r.name).join(', ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(conversation.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color={conversation.unread ? 'text.primary' : 'text.secondary'}
                            fontWeight={conversation.unread ? 500 : 400}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {conversation.lastMessage}
                          </Typography>
                          <Chip
                            size="small"
                            label={conversation.roleOffered}
                            sx={{
                              mt: 0.5,
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: theme.palette.secondary.main + '20',
                              color: theme.palette.secondary.main,
                            }}
                          />
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Chat View */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        mr: 1.5,
                        background: gradientColors[getAvatarColor(selectedConversation.recipients[0].name)],
                      }}
                    >
                      {getInitials(selectedConversation.recipients[0].name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {selectedConversation.recipients.map(r => r.name).join(', ')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={selectedConversation.roleOffered}
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            bgcolor: theme.palette.secondary.main + '20',
                            color: theme.palette.secondary.main,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedConversation.recipients.length > 1 ? `${selectedConversation.recipients.length} recipients` : selectedConversation.recipients[0].role}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Chat Messages */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {selectedConversation.messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        flexDirection: message.sender === 'admin' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: message.sender === 'admin'
                            ? 'linear-gradient(45deg, #16a085 0%, #1abc9c 100%)'
                            : gradientColors[getAvatarColor(message.sender.name)],
                        }}
                      >
                        {message.sender === 'admin' ? 'A' : getInitials(message.sender.name)}
                      </Avatar>
                      <Paper
                        elevation={0}
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderRadius: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender === 'admin'
                            ? theme.palette.primary.main
                            : theme.palette.background.default,
                          color: message.sender === 'admin'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                          border: message.sender !== 'admin'
                            ? `1px solid ${theme.palette.divider}`
                            : 'none',
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: message.sender === 'admin'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : theme.palette.text.secondary,
                            textAlign: 'right',
                          }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box
                  component="form"
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendingMessage}
                  />
                  <IconButton
                    color="primary"
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                      '&.Mui-disabled': {
                        bgcolor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                      },
                    }}
                  >
                    {sendingMessage ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 3,
                }}
              >
                <EmailIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6">No Conversation Selected</Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, maxWidth: 400 }}>
                  Select a conversation from the list to view messages or start new conversations from the Staff Profiles page.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;
