"use client"
import React, { useState } from 'react'

export default  function home() {
    const [role, setRole] = useState<string >();

    // Fetch role from cookies (assuming you have access to cookies here)
    React.useEffect(() => {
        const cookieRole = document.cookie
            .split('; ')
            .find(row => row.startsWith('role='))
            ?.split('=')[1];
        if (cookieRole) {
            setRole(decodeURIComponent(cookieRole));
        }
    }, []);

  return (
    <div>
        <h1>Home Page</h1>
        <div>
            <p>User Role: {role}</p>
        </div>
    </div>
  )
}

