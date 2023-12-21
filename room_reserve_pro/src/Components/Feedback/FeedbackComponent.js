import React, { useState , useRef } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "./feedbackComponent.css"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { addFeedback } from '../../Services/apiToCall';
import FeedbackAlert from '../Alert/AlertComponent';

const Feedback = () =>{

    const [alertStatus,setAlertStatus] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertMessageColor, setAlertMessageColor] = useState("");

    const reservationRef = useRef(null);
    const typeRef = useRef(null);
    const commentsRef = useRef(null);

    const handleClick = () =>{
        var reservationRefElem = reservationRef?reservationRef.current:null;
        var typeRefElem = typeRef?typeRef.current:null;
        var commentsRefElem = commentsRef?commentsRef.current:null;

        if(reservationRefElem && typeRefElem && commentsRefElem){
            var dataTSend = {
                reservation_id:reservationRefElem.value,
                message:commentsRefElem.value,
                type:typeRefElem.value,
                status:"open"
            }

            const callback = (data) =>{
                setAlertStatus(true);
               
                setTimeout(()=>{
                    setAlertStatus(false)
                    setAlertMessage("") 
                    if(reservationRefElem && typeRefElem && commentsRefElem){
                        reservationRefElem.value = "";
                        typeRefElem.value = "";
                        commentsRefElem.value = ""
                    }
                },3000)
                setAlertMessage("Loading . .  . Please wait")  
                setAlertMessageColor("black")
                if(data.data.success){
                    setAlertMessage("Successfully added the feedback ! ! !")  
                    setAlertMessageColor("success")
                }
                else{
                    setAlertMessage("Unable to add the feedback")
                    setAlertMessageColor("danger")
                }
            }
            addFeedback(dataTSend, callback)
        }
    }

    return(
        <div className='d-flex align-items-center justify-content-center mt-5'>
             {/* <FeedbackAlert></FeedbackAlert> */}
            {/* <div className='row'>
               
            </div> */}
            {/* <div className=''> */}
                <div className='form-div rounded py-3' style={{boxShadow:"-2px 1px 17px -4px rgba(0,0,0,0.3)"}}>
                    <div style={{height:"50px"}} className=' border-bottom broder-dark px-3'>
                        <h5 className='text-center text-primary'>Help us improve</h5>
                    </div>

                    <div className='container w-75 py-3'>

                        {/* Alert message */}
                        {alertStatus?<p className={'text-center '+ "text-"+alertMessageColor}><b>{alertMessage}</b></p>:''}

                        {/* Form starts */}
                        <div className='row mt-2'>
                            <div className='col-8'>
                            <label className='text-primary'>Reservation Id</label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                    ref={reservationRef}
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder='Enter Reservation Id if available'
                                    />
                                </InputGroup>
                                {/* Form ends */}
                            </div>
                            <div className='col-4'>
                                <label className='text-primary mb-1'>Type</label><br/>
                                <select className='border py-1 px-2 rounded' style={{width:"-webkit-fill-available"}} ref={typeRef}>
                                    <option value="disabled" disabled={true} selected>Select an option</option>
                                    <option value="Infrastructure Issues">Infrastructure Issues</option>
                                    <option value="Cleanliness Issues">Cleanliness Issues</option>
                                    <option value="Room unavailability">Room unavailability</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>  
                        </div>
                        <FloatingLabel controlId="floatingTextarea2" label="Please provide explanation about the issue" className='mt-3'>
                            <Form.Control
                            ref={commentsRef}
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '200px' }}
                            />
                        </FloatingLabel>
                        <Button variant="primary" className='mt-4 float-right' onClick={handleClick}>Submit</Button>
                    </div>
                </div>
            {/* </div> */}
           
        </div>
    )
}

export default Feedback;