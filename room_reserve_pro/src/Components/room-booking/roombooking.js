import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Button, List, Table } from 'antd';
import axios from 'axios';
import RoomSelectionModal from './RoomSelectionModal';
import './RoomBooking.css';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const RoomBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // New state variable for selected date
  const [calenderId, setCalendar] = useState('');
  const [userId, setUserId] = useState('');
  const [bookingsModalVisible, setBookingsModalVisible] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [universityId,setUniversityId] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  // Define the styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '16px',
    backgroundColor: '#f5f5f5', // Adjust the color to match your header's background color
  };

  const spotBookingButtonStyle = {
    backgroundColor: '#1890ff', // Ant Design primary color for the button
    borderColor: '#1890ff', // Border color to match
    color: 'white', // Text color
  };

  const profileButtonStyle = {
    backgroundColor: '#1890ff', // Adjust as needed
    borderColor: '#1890ff',
    color: 'white',
    marginRight: '10px', // Added to create a small space between the two buttons
  };
  
  const handleViewBookings = () => {
    axios.get('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/calendarBooking')
      .then(response => {
        const bookings = response.data.body;
        setBookings(bookings);
        setBookingsModalVisible(true);
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    // console.log("events", events);
  }, [events]);
  
  const handleSelect = (date) => {
    const now = new Date();
    now.setHours(0,0,0,0); // set the time to 00:00:00.000
    if (date >= now) {
      setSelectedDate(date); // Store the selected date
      setModalIsOpen(true);
    }
  };
  
  const handleRoomSelection = (roomIds,room, startime,endtime) => {
    setModalIsOpen(false);
    setSelectedRoom(room);
    setStartTime(startime);
    setEndTime(endtime)
    
    handleBooking(roomIds,selectedRoom, startTime, endTime,selectedDate); // Set start and end as needed
  };
  const handleBooking = async (roomIds,selectedRoom, startTime, endTime,selectedDate) => {
    const dateObject = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    const formattedDate = `${dateObject.getDate().toString().padStart(2, '0')}${(dateObject.getMonth() + 1).toString().padStart(2, '0')}${dateObject.getFullYear().toString().substr(-2)}`;
    const uuidv4 = require('uuid').v4;
    const newUuid = uuidv4();
    setCalendar(newUuid);
    // const uuidCalendar= uuidv4();
    // setCalendar(uuidCalendar)
    // const emaiul = "someEmail@email.com";
    const userData = JSON.parse(localStorage.getItem('user'));
    const email = userData.email;
    const universityId = userData.universityId;

    setUniversityId(universityId);
    setUserId(email);

    console.log("email", email);
    console.log("universityId", universityId);
    
    // console.log("events",events)

    // Call AWS API

    // console.log("this is creaging caledar")
    // console.log(newUuid,"calenderId");
    axios.post('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/calendarBooking/', {
      startTime:startTime,
      endTime: endTime,
      date: formattedDate,
      uuid: newUuid
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });

    console.log("starrtintg fetching Room")    
    const roomId = await fetchRoomId(roomIds,selectedRoom);
    const bookingId =  uuidv4();
    const status = "BOOKED";

    // // Creating the booking
    createBooking(newUuid, roomId, email, bookingId,status);  
    

  };
  

  const createBooking = (newUuid, roomId, email, bookingId, status) => {
    axios.post('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking', {
      calenderId:newUuid,
      roomId:roomId,
      userId:email,
      bookingId:bookingId,
      status:status
    }).then(response => {
      console.log(response);
      if (response.data.body.includes('Room is already booked')) {
        message.error('Room already occupied!');
      } else {
        message.success('Booking confirmed!');
        const newEvent = {
          startTime:startTime,
          endTime: endTime,
          room: selectedRoom,
          date: selectedDate,
          userId:userId,
          uuid:newUuid
        };
        setEvents([...events, newEvent]);
        axios({
          method: 'post',
          url: 'https://scqjzpsi66hbsgd2frxqa5m7mu0onfcx.lambda-url.us-east-1.on.aws/',
          headers: { 'Content-Type': 'application/json' },
          data: {
            bannerID: 'B00'+universityId,            
            email: email,
            message: 'This is to confirm that room '+selectedRoom+' has been booked on '+selectedDate+' at '+ startTime,
            subject: 'Room Booking Confirmation'
          }
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        });
        // Call the SNS function here, passing the necessary parameters
        // axios.post('https://scqjzpsi66hbsgd2frxqa5m7mu0onfcx.lambda-url.us-east-1.on.aws', {
        // header 'Content-Type: application/json',
        //   data-raw '{
        //     "bannerID":"B00942541",
        //     "email":"bh626198@dal.ca",
        //     "message":"This is test email",
        //     "subject":"Notification"
        // }' 
        //   bannerID: 'your-topic-name',
        //   message: 'Your booking was successful!',
        //   subject: 'Booking Confirmation',
        //   email: userId // Assuming userId is the user's email
        // });
      }
    }).catch(error => {
      console.error(error);
      message.error('Booking failed!');
    });
  };

  const fetchRoomId = async (roomIds,selectedRoom) => {
    console.log("all rooms: ",roomIds);
    console.log("selectedRoom: ,", selectedRoom);
    let roomId;
    roomId = Object.keys(roomIds).find(key => roomIds[key] === selectedRoom);

    
  //   for (let key in roomIds) {
  //     if (key === selectedRoom) {
  //       roomId = key;
  //       break;
  //     }
  // }
    console.log("FetchedroomId:",roomId)
    return roomId;    
  };

  const handleNavigate = (value) => {
    const date = value.toDate(); // Convert moment object to Date object
    setCurrentDate(date);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };
  const dateCellRender = (value) => {
    const date = value.date();
    const month = value.month();
    const year = value.year();
    console.log(events);
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    return (
      <ul>
        {dateEvents.map((event, index) => (
          <li key={index}>
            Room: {event.room} <br/>
            Time: {event.startTime} - {event.endTime}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="room-booking" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={headerStyle}>
        <h1 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>Room Booking</h1>
        <div>
        <Button 
          style={profileButtonStyle}
          type="primary"
          onClick={() => navigate('/user-profile')}
        >
          Profile
        </Button>
        <Button 
          style={spotBookingButtonStyle}
          type="primary"
          onClick={() => navigate('/spot-booking')}
        >
          Spot Booking
        </Button>
        </div>
      </div>
      <Calendar
        className="calendar"
        cellRender={dateCellRender}
        monthCellRender={(value) => {
          // Customize the month cell render here
        }}
        onSelect={handleSelect}
        onPanelChange={handleNavigate}
      />
      <RoomSelectionModal
        className="room-selection-modal"
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        handleRoomSelection={handleRoomSelection}
        setSelectedRoom={setSelectedRoom}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        selectedDate={selectedDate} // Pass the selected date as a prop
      />
      <Modal
        title="Your Bookings"
        visible={bookingsModalVisible}
        onCancel={() => setBookingsModalVisible(false)}
        footer={null}
      >
        <Table dataSource={bookings} rowKey="bookingId">
          <Table.Column 
            title="Start Time" 
            dataIndex="start_date_time" 
            key="start_date_time" 
            render={start_date_time => new Date(start_date_time).toLocaleString()}
          />
          <Table.Column 
            title="End Time" 
            dataIndex="end_date_time" 
            key="end_date_time" 
            render={end_date_time => new Date(end_date_time).toLocaleString()}
          />
          <Table.Column title="Room Name" dataIndex="roomName" key="roomName" />
          <Table.Column title="Location" dataIndex="location" key="location" />
        </Table>
      </Modal>
    </div>
  );  
};

export default RoomBooking;