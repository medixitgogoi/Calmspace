import axios from "axios";

export const fetchCounselors = async () => {
    try {
        const response = await axios.get('/counselor/getCounselor');

        console.log('counselor response: ', response);

        if (response?.status === 200) {
            return response?.data; // Return user data
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return null; // Return null in case of error
    }
};