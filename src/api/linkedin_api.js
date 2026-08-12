import axios from "axios";

export const uploadLinkedinZip = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(
        "http://localhost:8000/api/linkedin/upload-zip",  // ← fixed
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};