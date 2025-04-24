import axios from "axios";

export const fetchCounselors = async (authToken) => {
    try {
        const response = await axios.get('/counselor', {
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            }
        });

        console.log('counselor response: ', response);

        if (response?.status === 201) {
            return response?.data; // Return user data
        }

    } catch (error) {
        console.log("Error fetching counselors: ", error.message);
        return null; // Return null in case of error
    }
};