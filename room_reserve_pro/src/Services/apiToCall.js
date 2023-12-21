import axios from 'axios'

export const addFeedback = (data, callback) =>{
    var endPoint = "https://mycfhse372dep52niwp4yqgsdy0wonpj.lambda-url.us-east-1.on.aws/";
    axios.post(endPoint,data).then(data=>{
        callback(data)
    }).catch(err=>{
        console.log(err)
    })
}