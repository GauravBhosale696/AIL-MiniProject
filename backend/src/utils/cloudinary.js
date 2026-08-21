import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the fine on cloudinary
        const response = await cloudinary.uploader.upload
        cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded
        console.log("File is uploaded on Cloudinary",response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locallt saved temporary file as the uploaded operation got failed
        return null;
    }
}


cloudinary.v2.uploader
  .upload("/home/my_image.jpg")
  .then(result => console.log(result))
  .catch(error => console.error(error));