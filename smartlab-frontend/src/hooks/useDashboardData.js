// smartlab-frontend/src/hooks/useDashboardData.js
import { useState, useCallback, useEffect } from 'react';
import api from '../api/api';

export const useDashboardData = (user, onLogout) => {
  const [stats, setStats] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [availableLaboratories, setAvailableLaboratories] = useState([]);
  const [allLaboratories, setAllLaboratories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [feedbackMessage, setFeedbackMessage] = useState('');
  const [analyticsError, setAnalyticsError] = useState(null);

  const refreshDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    //setFeedbackMessage('');
    setAnalyticsError(null);

    try {
      let statsEndpoint = '/dashboard/stats';
      if (user.role === 'ALUNO') { statsEndpoint = '/dashboard/student/stats'; }
      else if (user.role === 'PROFESSOR') { statsEndpoint = '/dashboard/professor/stats'; }
      else if (user.role === 'ADMIN') { statsEndpoint = '/dashboard/admin/stats'; }
      const statsResponse = await api.get(statsEndpoint);
      setStats(statsResponse.data);

      if (user.role === 'ALUNO' || user.role === 'PROFESSOR') {
        const myBookingsResponse = await api.get('/bookings/my-bookings');
        setMyBookings(Array.isArray(myBookingsResponse.data) ? myBookingsResponse.data : []);
      }

      if (user.role === 'PROFESSOR' || user.role === 'ADMIN') {
        const pendingBookingsResponse = await api.get('/bookings/pending');
        setPendingBookings(Array.isArray(pendingBookingsResponse.data) ? pendingBookingsResponse.data : []);
      }

      if (user.role === 'ADMIN') {
        const allBookingsResponse = await api.get('/bookings/all');
        setAllBookings(Array.isArray(allBookingsResponse.data) ? allBookingsResponse.data : []);
      }

      const upcomingBookingsResponse = await api.get('/dashboard/upcoming');
      setUpcomingBookings(Array.isArray(upcomingBookingsResponse.data) ? upcomingBookingsResponse.data : []);
      
      if (user.role === 'ALUNO' || user.role === 'PROFESSOR') {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const startTimeParam = now.toISOString().slice(0, 19);
        const endTimeParam = oneHourLater.toISOString().slice(0, 19);
        const availableLabsResponse = await api.get(`/laboratories/available?startTime=${startTimeParam}&endTime=${endTimeParam}`);
        setAvailableLaboratories(Array.isArray(availableLabsResponse.data) ? availableLabsResponse.data : []);
      }

      if (user.role === 'ADMIN') {
        const allLabsResponse = await api.get('/laboratories');
        setAllLaboratories(Array.isArray(allLabsResponse.data) ? allLabsResponse.data : []);

        try {
          const analyticsResponse = await api.get('/dashboard/admin/analytics');
          setAnalyticsData(analyticsResponse.data);
        } catch (analyticsErr) {
          console.error('Erro ao buscar dados analíticos:', analyticsErr);
          setAnalyticsError('Não foi possível carregar os dados analíticos.');
          setAnalyticsData(null);
        }
      }

    } catch (err) {
      setError('Erro ao carregar dados do dashboard: ' + (err.response?.data?.message || err.message || JSON.stringify(err.response?.data)));
      console.error('Erro ao buscar dados do dashboard:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user.role, onLogout]);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  return {
    stats,
    myBookings,
    pendingBookings,
    allBookings,
    upcomingBookings,
    availableLaboratories,
    allLaboratories,
    analyticsData,
    loading,
    error,
    //feedbackMessage,
    //setFeedbackMessage,
    analyticsError,
    refreshDashboardData,
  };
};