import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firbaseConfig';
import { cleanFirebaseUser } from '../utils/cleanUser';
import { setUser, clearUser } from '../redux/authSlice';

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cleanUser = cleanFirebaseUser(user);
        dispatch(setUser(cleanUser));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
