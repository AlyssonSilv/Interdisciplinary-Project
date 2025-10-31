// smartlab-frontend/src/hooks/useBookingActions.js
import api from '../api/api';
import { toast } from 'react-toastify'; // <- 1. IMPORTAR

// Não precisamos mais de 'setFeedbackMessage'
export const useBookingActions = (refreshDashboardData) => {
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Agendamento cancelado com sucesso.'); // <- 2. MUDAR
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data || err.message || "Erro desconhecido";
      toast.error(`Erro ao cancelar: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao cancelar agendamento:', err);
    }
  };

  const handleApproveRejectBooking = async (bookingId, status, adminNotes = '') => {
    if (!window.confirm(`Tem certeza que deseja ${status === 'APPROVED' ? 'APROVAR' : 'REJEITAR'} este agendamento?`)) {
      return;
    }
    try {
      await api.patch(`/dashboard/bookings/${bookingId}/status`, { status, rejectedReason: adminNotes });
      const successMsg = `Agendamento ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso.`;
      toast.success(successMsg); // <- 2. MUDAR
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data || err.message || "Erro desconhecido";
      toast.error(`Erro ao atualizar status: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Tem certeza que deseja EXCLUIR este agendamento? Esta ação é irreversível.')) {
      return;
    }
    try {
      await api.delete(`/dashboard/bookings/${bookingId}`);
      toast.success('Agendamento excluído com sucesso.'); // <- 2. MUDAR
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data || err.message || "Erro desconhecido";
      toast.error(`Erro ao excluir: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao excluir agendamento:', err);
    }
  };

  return {
    handleCancelBooking,
    handleApproveRejectBooking,
    handleDeleteBooking,
  };
};