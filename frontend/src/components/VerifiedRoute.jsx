import { Navigate } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";


function VerifiedRoute({ children, requiresRevendedor = false }) {
    const [isVerified, setIsVerified] = useState(null);
    const [isRevendedor, setIsRevendedor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkVerification();
    }, []);

    const checkVerification = async () => {
        try {
            const response = await api.get("/letrajato/verify-status/");
            
            if (response.status === 200) {
                setIsVerified(response.data.verificado);
                setIsRevendedor(response.data.is_revendedor);
            } else {
                setIsVerified(false);
                setIsRevendedor(false);
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            setIsVerified(false);
            setIsRevendedor(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isVerified && isRevendedor) {
        return <Navigate to="/verification-pending" />;
    }

    if (!isRevendedor) {
        return <Navigate to="/home" />;
    }

    return children;
}

export default VerifiedRoute;
