import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function FeedbackAlert() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert style={{position:"absolute",top:0,right:0}} variant="success" onClose={() => setShow(false)} dismissible>
        <p>
         Feedback added successfully! ! !
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default FeedbackAlert;