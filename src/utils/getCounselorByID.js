import axios from "axios";

export const getCounselorByID = async (authToken) => {
    try {
        const response = await axios.get('/counselor/counselorbyid', {
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            }
        });

        console.log('counselor by id response: ', response);

        if (response?.status === 201) {
            return response?.data; // Return feature data
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return null; // Return null in case of error
    }
};