import { Navigate } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";


function VerifiedRoute({ children }) {
    const [isVerified, setIsVerified] = useState(null);

    useEffect(() => {
        verify().catch(() => setIsVerified(false))
    }, [])

    const verify = async () => {
        try{
            const response = await api.get("/letrajato/verify-status/");
                
            if (response.status === 200) {
                setIsVerified(response.data.verificado);
            } else {
                setIsVerified(false);
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            setIsVerified(false);
        }
    };

    if (isVerified === null) {
        return <div>Loading...</div>;
    }

    return isVerified ? children : <Navigate to="/verification-pending" />;
}

export default VerifiedRoute;
