import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getUserProfile(token);
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h1>{profile.fullName}</h1>
          <p>{profile.emailAddress}</p>
          <p>{profile.phoneNumber}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
