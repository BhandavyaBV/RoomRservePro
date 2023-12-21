import { Controller, useForm } from "react-hook-form";
import {
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import useRooms from "../../../hooks/useRooms";
import TableComponent from "../../TableComponent/TableComponent";
import { adminContext } from "../../../contexts/AdminProvider";

const HEADERS = [
    { name: "ID", key: "room_id" },
    { name: "Name", key: "room_name" },
    { name: "Type", key: "room_type" },
    { name: "Capacity", key: "capacity" },
    { name: "Lapacity", key: "location" },
    { name: "Action", key: "action" },
];

const ROOM_TYPES = [
    { value: "Spot booking", label: "Spot booking" },
    { value: "Future booking", label: "Future booking" },
];

const AdminRoomManagmenet = () => {
    const { redirectIfNotLoggedIn } = useContext(adminContext);
    redirectIfNotLoggedIn();
    const [show, setShow] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const selecteRoomRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
    } = useForm({
        defaultValues: {
            room_name: "",
            room_type: ROOM_TYPES[0].value,
            capacity: null,
            location: "",
        },
    });
    const handleClose = () => {
        setShow(false);
        reset();
        selecteRoomRef.current = null;
    };
    const handleDeleteDialogClose = () => {
        setDeleteDialog(false);
    };
    const {
        data: rooms,
        isLoading,
        addRoomMutation: { mutate: addRoom, isPending: isAddingRoom },
        updateRoomMutation: { mutate: updateRoom, isPending: isUpdatingRoom },
        deleteRoomMutation: { mutate: deleteRoom, isPending: isDeletingRoom },
    } = useRooms(handleClose, handleClose, handleDeleteDialogClose);
    if (isLoading)
        return (
            <div
                style={{ height: "calc(100vh - 120px)" }}
                className="flex justify-center items-center "
            >
                <CircularProgress />
            </div>
        );

    const submitForm = (data) => {
        if (selecteRoomRef.current) {
            updateRoom({
                room_name: data.room_name,
                location: data.location,
                capacity: parseInt(data.capacity, 10),
                room_type: data.room_type,
                room_id: selecteRoomRef.current.room_id,
            });
        } else {
            addRoom({
                room_name: data.room_name,
                location: data.location,
                capacity: parseInt(data.capacity, 10),
                room_type: data.room_type,
            });
        }
    };

    const formattedRooms = rooms.map((room) => ({
        room_id: room.room_id,
        room_name: room.room_name,
        room_type: room.room_type,
        capacity: room.capacity,
        location: room.location,
        action: (
            <>
                <Button
                    variant="contained"
                    onClick={() => {
                        selecteRoomRef.current = room;
                        setShow(true);
                        setValue("room_name", room.room_name);
                        setValue("room_type", room.room_type);
                        setValue("capacity", room.capacity);
                        setValue("location", room.location);
                    }}
                >
                    Edit
                </Button>
                <Button
                    onClick={() => {
                        selecteRoomRef.current = room;
                        setDeleteDialog(true);
                    }}
                    variant="contained"
                    color="error"
                    style={{ marginLeft: "10px" }}
                >
                    Delete
                </Button>
            </>
        ),
    }));

    return (
        <Container  style={{padding: "20px 0"}}>
            <Typography style={{ marginTop: "30px" }} variant="h4">
                Manage Rooms
            </Typography>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "25px 0",
                }}
            >
                <Button variant="contained" onClick={() => setShow(true)}>
                    Add new room
                </Button>
            </div>
            <div>
                <TableComponent headers={HEADERS} data={formattedRooms} />
            </div>
            <Dialog open={show} onClose={handleClose}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <DialogTitle>
                        {selecteRoomRef.current ? "Update room" : "Add room"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Room name"
                            type="text"
                            fullWidth
                            variant="standard"
                            error={!!errors.room_name}
                            {...register("room_name", { required: true })}
                        />
                        <Controller
                            control={control}
                            name="room_type"
                            rules={{ required: true }}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <FormControl
                                    error={!!error}
                                    style={{
                                        width: "100%",
                                        margin: "10px 0 0 0",
                                    }}
                                >
                                    <InputLabel id="room_type_select">
                                        Room type
                                    </InputLabel>
                                    <Select
                                        labelId="room_type_select"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value);
                                        }}
                                    >
                                        {ROOM_TYPES.map((type) => (
                                            <MenuItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Capacity"
                            type="text"
                            fullWidth
                            variant="standard"
                            error={!!errors.capacity}
                            {...register("capacity", { required: true })}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Location"
                            type="text"
                            fullWidth
                            variant="standard"
                            error={!!errors.location}
                            {...register("location", { required: true })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isAddingRoom || isUpdatingRoom}
                        >
                            {selecteRoomRef.current
                                ? isUpdatingRoom
                                    ? "Updating..."
                                    : "Update"
                                : isAddingRoom
                                ? "Adding..."
                                : "Add"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={deleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete room</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete room{" "}
                        {selecteRoomRef.current?.room_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            deleteRoom({
                                room_id: selecteRoomRef.current.room_id,
                            });
                        }}
                        autoFocus
                        disabled={isDeletingRoom}
                        variant="contained"
                        color="error"
                    >
                        {isDeletingRoom? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
export default AdminRoomManagmenet;
