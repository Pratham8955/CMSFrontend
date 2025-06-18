import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner } from "react-bootstrap";

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get("http://localhost:5291/api/Feedback/GetFeedBack");
                if (response.data.success) {
                    setFeedbackList(response.data.feedback);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="container">
            <h3 className="mb-4 text-primary">📬 Feedback</h3>

            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : feedbackList.length === 0 ? (
                <p className="text-muted fst-italic">No feedback found.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackList.map((fb, index) => (
                            <tr key={fb.feedbackId}>
                                <td>{index + 1}</td>
                                <td>{fb.name}</td>
                                <td>{fb.email}</td>
                                <td>{fb.subject}</td>
                                <td>{fb.message}</td>
                                <td>{new Date(fb.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Feedback;
