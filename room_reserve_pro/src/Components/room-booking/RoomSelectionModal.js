import React, { useState, useEffect } from 'react';
import { Modal, Select, Row, Col, TimePicker } from 'antd';
import Button from '@mui/material/Button';

const { Option } = Select;

const RoomSelectionModal = ({
  modalIsOpen,
  setModalIsOpen,
  handleRoomSelection,
  setSelectedRoom,
  setStartTime,
  setEndTime,
  selectedDate
}) => {
  const [locations, setLocations] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [roomIds, setRoomIds] = useState({});
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false); // State to track whether search button is clicked


  useEffect(() => {
    fetchLocations();
    fetchCapacities();
    fetchRooms();
  }, []);
  useEffect(() => {
    setFilteredRooms(rooms.filter(room => {
      return (selectedLocation === 'None' || !selectedLocation || room.location === selectedLocation) && 
             (selectedCapacity === 'None' || !selectedCapacity || room.capacity >= selectedCapacity);
    }));
  }, [selectedLocation, selectedCapacity, rooms]);
  

  const fetchRooms = () => {
    fetch('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/')
      .then((response) => response.json())
      .then((data) => {
        const roomIds = Object.keys(data.body);
        const roomObjects = Object.values(data.body).map((room, index) => ({
          id: roomIds[index],
          name: room.name,
          location: room.location,
          capacity: room.capacity,
        }));

        // Create an object where the key is the room ID and the value is the room name
        const roomIdsAndNames = roomObjects.reduce((acc, room) => {
          acc[(room.id).toString()] = room.name;
          return acc;
        }, {});

        setRoomIds(roomIdsAndNames);
        setRooms(roomObjects);
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchLocations = () => {
    fetch('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/roomFilter/location')
      .then((response) => response.json())
      .then((data) => setLocations(data.body))
      .catch((error) => console.error('Error:', error));
  };

  const fetchCapacities = () => {
    fetch('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/roomFilter/capacity')
      .then((response) => response.json())
      .then((data) => setCapacities(data.body))
      .catch((error) => console.error('Error:', error));
  };
  const handleSearch = () => {
    setSearchClicked(true);
    const apiUrl = 'https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/booking/roomFilter/filteredRoomFetch';  
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        location: selectedLocation,
        capacity: selectedCapacity,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        selectedDate: selectedDate
      }),
    };
  
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Search Results:', data.body);
        setFilteredRooms(data.body); // set the response data to the filteredRooms state
        console.log(filteredRooms)
      })
      .catch((error) => console.error('Error:', error));
  };
  useEffect(() => {
    console.log(filteredRooms);
  }, [filteredRooms]);
  

  
  

  return (
    <Modal
      title="Search for Available Rooms"
      visible={modalIsOpen}
      onOk={handleRoomSelection}
      onCancel={() => setModalIsOpen(false)}
      footer={[
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleRoomSelection(roomIds)}>
          Submit
        </Button>,
        <Button key="back" onClick={() => setModalIsOpen(false)}>
          Cancel
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Select
            style={{ width: '100%', marginBottom: '20px' }}
            placeholder="Select a location"
            onChange={(value) => setSelectedLocation(value)}
          >
            <Option key="None" value="None">
              None
            </Option>
            {locations.map((location) => (
              <Option key={location} value={location}>
                {location}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            style={{ width: '100%', marginBottom: '20px' }}
            placeholder="Select a capacity"
            onChange={(value) => setSelectedCapacity(value)}
          >
            <Option key="None" value="None">
              None
            </Option>
            {capacities.map((capacity) => (
              <Option key={capacity} value={capacity}>
                {capacity}
              </Option>
            ))}
          </Select>
        </Col>
        <TimePicker
          className="time-picker-ok-visible" // Add the class to TimePicker
          style={{ width: '100%', marginBottom: '20px' }}
          use12Hours
          format="h:mm a"
          placeholder="Select start time"
          onChange={(time, timeString) => [setSelectedStartTime(timeString),setStartTime(timeString)]}
        />
        <TimePicker
          className="time-picker-ok-visible" // Add the class to TimePicker
          style={{ width: '100%' }}
          use12Hours
          format="h:mm a"
          placeholder="Select end time"
          onChange={(time, timeString) => [setSelectedEndTime(timeString),setEndTime(timeString)]}
        />
        <Select
          style={{ width: '100%', marginBottom: '20px' }}
          placeholder="Select a room"
          onChange={(value) => setSelectedRoom(value)}
          disabled={!searchClicked} // Disable the Select component if search button is not clicked
        >
          {filteredRooms.map((room) => (
            <Option key={room.room_name} value={room.room_name}>
              {room.room_name}
            </Option>
          ))}
        </Select>
      </Row>
    </Modal>
  );
};

export default RoomSelectionModal;
