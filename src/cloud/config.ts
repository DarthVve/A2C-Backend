const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "pode-liveproject",
    api_key: "746935268851445",
    api_secret: "ZIlqUod81ghMwPWlla7ptSnq5-k"
});
// console.log(cloudinary.config());
//cloudinary://746935268851445:ZIlqUod81ghMwPWlla7ptSnq5-k@pode-liveproject

export const uploadImg = async(avatar: string) => {
    try {
        const result = await cloudinary.uploader.upload(avatar, {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });

        return result.public_id;
    } catch(err) {
        console.error(err);
        return null;
    }
} 

export const deleteImg = async(id: string) => {
    try {
        return await cloudinary.uploader.destroy(id) 
    } catch (err) {
        console.error(err);
    }
}