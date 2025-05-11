import { Navigate } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";


function VerifiedRoute({ children, requiresRevendedor = false }) {
    const [isVerified, setIsVerified] = useState(null);
    const [isRevendedor, setIsRevendedor] = useState(null);
    const [isStaff, setisStaff] = useState(null);
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
                setisStaff(response.data.is_staff);
            } else {
                setIsVerified(false);
                setIsRevendedor(false);
                setisStaff(false);
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            setIsVerified(false);
            setIsRevendedor(false);
            setisStaff(false);
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

    if (!isRevendedor && !isStaff) {
        return <Navigate to="/home" />;
    }

    return children;
}

export default VerifiedRoute;
