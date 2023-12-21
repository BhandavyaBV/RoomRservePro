import React, { useContext } from "react";
import { adminContext } from "../../../contexts/AdminProvider";
import useFeedbacks from "../../../hooks/useFeedbacks";
import { CircularProgress, Container, Typography } from "@mui/material";
import TableComponent from "../../TableComponent/TableComponent";

const HEADERS = [
  { name: "Feedback id", key: "feedback_id" },
  { name: "Message", key: "message" },
  { name: "Reservation id", key: "reservation_id" },
  { name: "Type", key: "type" },
  { name: "Status", key: "status" },
];

const AdminFeedbacks = () => {
  const { redirectIfNotLoggedIn } = useContext(adminContext);
  redirectIfNotLoggedIn();
  const { data: feedbacks, isLoading } = useFeedbacks();
  const formattedFeedbacks = feedbacks?.map((feedback) => {
    return {
      feedback_id: feedback.feedback_id,
      message: feedback.message,
      reservation_id: feedback.reservation_id,
      type: feedback.type,
      status: feedback.status,
    };
  });
  if (isLoading)
    return (
      <div
        style={{ height: "calc(100vh - 120px)" }}
        className="flex justify-center items-center "
      >
        <CircularProgress />
      </div>
    );
  return (
    <Container style={{ padding: "20px 0" }}>
      <Typography style={{ margin: "30px 0" }} variant="h4">
        Feedbacks
      </Typography>
      <TableComponent headers={HEADERS} data={formattedFeedbacks} />
    </Container>
  );
};

export default AdminFeedbacks;
