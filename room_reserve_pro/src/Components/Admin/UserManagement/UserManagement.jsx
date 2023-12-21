import React, { useContext, useRef, useState } from "react";
import useUsers from "../../../hooks/useUsers";
import TableComponent from "../../TableComponent/TableComponent";
import {
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import { adminContext } from "../../../contexts/AdminProvider";

const headers = [
    {
        name: "ID",
        key: "id",
    },
    {
        name: "Name",
        key: "name",
    },
    {
        name: "Email",
        key: "email",
    },
    {
        name: "Phone",
        key: "phone",
    },
    {
        name: "University ID",
        key: "universityId",
    },
    {
        name: "Action",
        key: "action",
    },
];

const AdminUserManagement = () => {
    const {redirectIfNotLoggedIn} = useContext(adminContext);
    redirectIfNotLoggedIn();
    const [showDialog, setShowDialog] = useState(false);
    const handleDialogClose = () => setShowDialog(false);
    const {
        data: users,
        isLoading,
        updateUserStatusMutation: { mutate: updateUserStatus, isPending: isUpdatingUserStatus },
    } = useUsers(handleDialogClose);

    const selectedUserRef = useRef(null);
    if (isLoading) return <div style={{height: "calc(100vh - 120px)"}} className="flex justify-center items-center "><CircularProgress /></div>;
    const formatActiveUserData = (users) => {
        return users
            .filter((user) => !user.isBanned)
            .map((user) => {
                return {
                    id: user.userId,
                    name: user.name,
                    email: user.email,
                    phone: user.phoneNumber,
                    universityId: user.universityId,
                    action: (
                        <Button
                           variant="contained"
                            onClick={() => {
                                selectedUserRef.current = {
                                    email: user.email,
                                    isBanned: user.isBanned,
                                };
                                setShowDialog(true);
                            }}
                            color="error"
                        >
                            Ban
                        </Button>
                    ),
                };
            });
    };
    const formatBannedUserData = (users) => {
        return users
            .filter((user) => user.isBanned)
            .map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    universityId: user.universityId,
                    action: (
                        <Button
                        variant="contained"
                            onClick={() => {
                                selectedUserRef.current = {
                                    email: user.email,
                                    isBanned: user.isBanned,
                                };
                                setShowDialog(true);
                            }}
                        >
                            Unban
                        </Button>
                    ),
                };
            });
    };
    const activeTableData = formatActiveUserData(users);
    const bannedTableData = formatBannedUserData(users);

    return (
        <Container  style={{padding: "20px 0"}}>
            <Typography style={{paddingTop: "30px"}} variant="h4" gutterBottom>
                Active users
            </Typography>
            <TableComponent headers={headers} data={activeTableData} />
            <Typography style={{paddingTop: "30px"}}  variant="h4" gutterBottom>
                Banned users
            </Typography>
            <TableComponent headers={headers} data={bannedTableData} />
            <Dialog
                open={showDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {selectedUserRef.current?.isBanned
                        ? "Unban user"
                        : "Ban user"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to{" "}
                        {selectedUserRef.current?.isBanned
                            ? "unban user"
                            : "ban user"}{" "}
                        {selectedUserRef.current?.email}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            updateUserStatus(selectedUserRef.current);
                        }}
                        autoFocus
                        disabled={isUpdatingUserStatus}
                    >
                        {isUpdatingUserStatus ? "Saving..." : "Continue"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminUserManagement;
