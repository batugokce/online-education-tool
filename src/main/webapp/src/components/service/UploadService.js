import axios from 'axios';
import authHeader from "./authHeader";
class UploadService{
    upload(file,onUploadProgress){
        let FormData=new FormData();
        FormData.append("file",file);
        return axios.post("api/v1/student/changeImage/",FormData,{headers:authHeader()+{"Content-Type": "multipart/form-data",},onUploadProgress,});
    }

}
export default new UploadService();