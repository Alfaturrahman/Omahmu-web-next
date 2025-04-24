// hoc/withAuth.js
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (Component, allowedRoles) => {
    return function AuthWrapper(props) {
        const router = useRouter();
        const [isAllowed, setIsAllowed] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role_id');

            // Jika token tidak ada atau role tidak sesuai, redirect ke halaman login
            if (!token || !allowedRoles.includes(role)) {
                router.replace('/Login'); // Redirect ke halaman login jika role tidak cocok
                setIsAllowed(false);
            } else {
                setIsAllowed(true); // Jika role sesuai, biarkan komponen ditampilkan
            }
        }, [router]);

        if (!isAllowed) return null; // Bisa tampilkan loading spinner jika role belum sesuai

        return <Component {...props} />;
    };
};

export default withAuth;
