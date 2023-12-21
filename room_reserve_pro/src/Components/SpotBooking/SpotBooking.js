// SlotBooking.js

import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogTitle } from '@mui/material';

const SlotBooking = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [bookingSuccessful, setBookingSuccessful] = useState(false);
  
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const handleSearch = async () => {
        // Construct ISO date strings for the current date with the selected times
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const startDateTime = `${currentDate}T${startTime}:00`;
        const endDateTime = `${currentDate}T${endTime}:00`;

        try {
            const response = await fetch('https://fgsxkd2j6wl55tr6hlsqwnxoxy0uexxv.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_datetime: startDateTime,
                    end_datetime: endDateTime,
                }),
            });
            const data = await response.json();
            setAvailableRooms(data); // Assuming the response data is the array of rooms
        } catch (error) {
            console.error('There was an error retrieving the available rooms:', error);
        }
    };

    const handleBookRoom = async () => {
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const startDateTime = `${currentDate}T${startTime}:00`;
        const endDateTime = `${currentDate}T${endTime}:00`;
    
        // Retrieve and parse the 'user' object from local storage
        const userString = localStorage.getItem('user');
        let userId = "";
    
        if (userString) {
            const userObject = JSON.parse(userString);
            userId = userObject.email; // Extract the email from the user object
        }
    
        // If no user object or email, handle the error appropriately
        if (!userId) {
            console.error('No user email found in local storage.');
            return; // Exit the function or show an error message to the user
        }
    
        try {
            const response = await fetch('https://i3skqkogkwwa4z4je2avezcka40ahqto.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId, // Use the retrieved email as the user_id
                    room_id: selectedRoom,
                    start_date_time: startDateTime,
                    end_date_time: endDateTime,
                }),
            });
    
            // Check if the response status is OK
            if (response.ok) {
                const data = await response.json();
                console.log('Booking data:', data);
                setBookingSuccessful(true);
                sendBookingConfirmation(); // Call the function to send the booking confirmation
            } else {
                console.error('Non-200 response', response.status);
                // Handle non-200 responses
            }
        } catch (error) {
            console.error('There was an error booking the room:', error.message);
        }
    };

    const sendBookingConfirmation = async () => {
        if (!userObject) return; // Check if the user object is null

        const roomName = availableRooms.find(room => room.room_id === selectedRoom)?.room_name || "the selected";

        try {
            await fetch('https://scqjzpsi66hbsgd2frxqa5m7mu0onfcx.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bannerID: `B00${userObject.universityId}`,
                    email: userObject.email,
                    message: `Your booking is successful for ${roomName} room from ${startTime} to ${endTime}`,
                    subject: "Notification"
                }),
            });
        } catch (error) {
            console.error('Error sending booking confirmation:', error);
        }
    };
    
    const handleClose = () => {
        setBookingSuccessful(false);
        // Reset form states
        setStartTime('');
        setEndTime('');
        setSelectedRoom('');
        setAvailableRooms([]);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Spot Booking</h2>
                <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 1800 }} // 30 min intervals
                />
                <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 1800 }} // 30 min intervals
                />
                <Button variant="contained" onClick={handleSearch} fullWidth>Search</Button>
                <FormControl fullWidth>
                    <InputLabel id="room-select-label">Available Rooms</InputLabel>
                    <Select
                        labelId="room-select-label"
                        value={selectedRoom}
                        label="Available Rooms"
                        onChange={e => setSelectedRoom(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: '300px'
                                }
                            }
                        }}
                    >
                        {availableRooms.map((room) => (
                            <MenuItem key={room.room_id} value={room.room_id}>{room.room_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleBookRoom} fullWidth>
                    Book Now
                </Button>
            </Box>
            <Dialog
                open={bookingSuccessful}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    Room is booked
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SlotBooking;