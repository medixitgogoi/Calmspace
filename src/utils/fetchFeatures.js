import axios from "axios";

export const fetchFeatures = async () => {
    try {
        const response = await axios.get('/feauture');

        console.log('feature response: ', response);
        
        if (response?.data?.status_code === 201) {
            return response?.data?.data; // Return user data
        }
        // return response?.data; // Return user data

    } catch (error) {
        console.log("Error: ", error.message);
        return null; // Return null in case of error
    }
};