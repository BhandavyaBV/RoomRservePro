import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import TableComponent from "../../TableComponent/TableComponent";
import useBookings from "../../../hooks/useBookings";
import { adminContext } from "../../../contexts/AdminProvider";

const HEADERS = [
    { name: "Booking ID", key: "bookingId" },
    { name: "Room ID", key: "room_id" },
    { name: "Start Time", key: "start_date_time" },
    { name: "Status", key: "status" },
    { name: "User ID", key: "user_id" },
    { name: "Action", key: "action" },
];

const AdminBookingsManagement = () => {
    const {redirectIfNotLoggedIn} = useContext(adminContext);
    redirectIfNotLoggedIn();
    const [showDialog, setShowDialog] = useState(false);
    const handleClose = () => setShowDialog(false);
    const selectedBookingRef = useRef(null);
    const {data, cancelBookingMutation: {
        mutate: cancelBooking,
        isPending: isCancelingBooking,
    }} = useBookings(handleClose);
    const formattedRooms = data?.map((booking) => {
        return {
            bookingId: booking.bookingId,
            room_id: booking.room_id,
            start_date_time: booking.start_date_time,
            status: booking.status,
            user_id: booking.user_id,
            action: <Button onClick={() => {
                selectedBookingRef.current = booking;
                setShowDialog(true);
            }} variant="contained" color="error">Cancel</Button>,
        };
    });
    return (
        <Container style={{padding: "20px 0"}}>
            <Typography style={{margin: "30px 0"}} variant="h4">Manage Bookings</Typography>
            <div>
                <TableComponent headers={HEADERS} data={formattedRooms} />
            </div>
            <Dialog
                open={showDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Cancel booking
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            cancelBooking(selectedBookingRef.current.bookingId);
                            handleClose();
                        }}
                        autoFocus
                        disabled={isCancelingBooking}
                    >
                        {isCancelingBooking ? "Cancelling..." : "Continue"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminBookingsManagement;
