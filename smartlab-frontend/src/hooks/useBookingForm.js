// smartlab-frontend/src/hooks/useBookingForm.js
import { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

export const useBookingForm = (refreshDashboardData) => {
  const [newBookingLabId, setNewBookingLabId] = useState('');
  const [newBookingDate, setNewBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [newBookingPurpose, setNewBookingPurpose] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [availablePeripherals, setAvailablePeripherals] = useState([]);
  const [selectedPeripherals, setSelectedPeripherals] = useState({});

  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isPeripheralsLoading, setIsPeripheralsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. ADICIONAR ESTADOS PARA RECORRÊNCIA ---
  const [isRecurring, setIsRecurring] = useState(false);
  const [numWeeks, setNumWeeks] = useState(4); // Padrão de 4 semanas

  // ... (useEffect de fetchTimeSlots inalterado) ...
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (newBookingLabId && newBookingDate) {
        setIsSlotsLoading(true);
        try {
          const response = await api.get(`/laboratories/${newBookingLabId}/available-slots?date=${newBookingDate}`);
          setAvailableTimeSlots(Array.isArray(response.data) ? response.data : []);
          setSelectedTimeSlot('');
        } catch (err) {
          console.error("Erro ao buscar slots de tempo:", err);
          setAvailableTimeSlots([]);
          toast.error('Erro ao buscar horários disponíveis.');
        } finally {
          setIsSlotsLoading(false);
        }
      } else {
        setAvailableTimeSlots([]);
        setSelectedTimeSlot('');
      }
    };
    fetchTimeSlots();
  }, [newBookingLabId, newBookingDate]);

  // ... (useEffect de fetchPeripherals inalterado) ...
  useEffect(() => {
    const fetchPeripherals = async () => {
      if (newBookingLabId) {
        setIsPeripheralsLoading(true);
        try {
          const response = await api.get(`/laboratories/${newBookingLabId}/peripherals`);
          setAvailablePeripherals(Array.isArray(response.data) ? response.data : []);
          setSelectedPeripherals({});
        } catch (err) {
          console.error("Erro ao buscar periféricos:", err);
          setAvailablePeripherals([]);
          toast.error('Erro ao buscar periféricos para este laboratório.');
        } finally {
          setIsPeripheralsLoading(false);
        }
      } else {
        setAvailablePeripherals([]);
        setSelectedPeripherals({});
      }
    };
    fetchPeripherals();
  }, [newBookingLabId]);

  // ... (handlePeripheralQuantityChange inalterado) ...
  const handlePeripheralQuantityChange = (peripheralId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return;

    const peripheral = availablePeripherals.find(p => p.id === peripheralId);
    if (!peripheral) return;

    if (qty > peripheral.quantity) {
      toast.warn(`Quantidade máxima para ${peripheral.name} é ${peripheral.quantity}.`);
      return;
    }

    setSelectedPeripherals(prev => {
      if (qty === 0) {
        const newState = { ...prev };
        delete newState[peripheralId];
        return newState;
      }
      return { ...prev, [peripheralId]: qty };
    });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    if (!selectedTimeSlot) {
      toast.error('Por favor, selecione um horário disponível.');
      setIsSubmitting(false);
      return;
    }

    const [startTimeStr, endTimeStr] = selectedTimeSlot.split(' - ');
    const bookingStartTime = `${newBookingDate}T${startTimeStr}:00`;
    const bookingEndTime = `${newBookingDate}T${endTimeStr}:00`;

    const peripheralsToSend = Object.keys(selectedPeripherals).map(id => ({
      peripheralId: parseInt(id, 10),
      quantity: selectedPeripherals[id],
    }));

    try {
      const bookingData = {
        laboratoryId: newBookingLabId,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        purpose: newBookingPurpose,
        peripherals: peripheralsToSend,
      };

      // --- 2. ADICIONAR DADOS RECORRENTES AO OBJETO ---
      // (O backend precisará ser atualizado para ler isso)
      if (isRecurring && (numWeeks > 0 || numWeeks === '')) {
        const weeks = numWeeks === '' ? 1 : parseInt(numWeeks, 10);
        bookingData.isRecurring = true;
        bookingData.numWeeks = weeks;
        toast.info(`Enviando agendamento recorrente para ${weeks} semanas.`);
      }

      await api.post('/bookings', bookingData);
      toast.success('Agendamento criado com sucesso! Aguardando aprovação.');
      
      // Resetar formulário
      setNewBookingLabId('');
      setNewBookingDate(new Date().toISOString().slice(0, 10));
      setAvailableTimeSlots([]);
      setSelectedTimeSlot('');
      setNewBookingPurpose('');
      setAvailablePeripherals([]);
      setSelectedPeripherals({});
      setShowBookingForm(false);
      setIsRecurring(false); // Resetar recorrência
      setNumWeeks(4); // Resetar semanas
      
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data || err.message || "Erro desconhecido";
      toast.error(`Erro ao criar agendamento: ${errorMsg}`);
      console.error('Erro ao criar agendamento:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    newBookingLabId, setNewBookingLabId,
    newBookingDate, setNewBookingDate,
    availableTimeSlots,
    selectedTimeSlot, setSelectedTimeSlot,
    newBookingPurpose, setNewBookingPurpose,
    showBookingForm, setShowBookingForm,
    availablePeripherals,
    selectedPeripherals,
    handlePeripheralQuantityChange,
    handleCreateBooking,
    isSlotsLoading,
    isPeripheralsLoading,
    isSubmitting,
    // --- 3. RETORNAR OS NOVOS ESTADOS ---
    isRecurring,
    setIsRecurring,
    numWeeks,
    setNumWeeks,
  };
};