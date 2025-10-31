// smartlab-frontend/src/hooks/useAdminManagement.js
import { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify'; // <- 1. IMPORTAR

// Não precisamos mais de 'setFeedbackMessage'
export const useAdminManagement = (refreshDashboardData) => {
  const [showManageLabs, setShowManageLabs] = useState(false);
  const [showManagePeripherals, setShowManagePeripherals] = useState(false);
  const [currentLaboratory, setCurrentLaboratory] = useState(null);
  const [currentPeripheral, setCurrentPeripheral] = useState(null);
  const [showLabForm, setShowLabForm] = useState(false);
  const [showPeripheralForm, setShowPeripheralForm] = useState(false);
  const [peripheralsOfCurrentLab, setPeripheralsOfCurrentLab] = useState([]);
  const [isPeripheralsLoading, setIsPeripheralsLoading] = useState(false); // Loading para lista de periféricos

  const handleCreateOrUpdateLab = async (labData) => {
    try {
      if (labData.id) {
        await api.put(`/laboratories/${labData.id}`, labData);
        toast.success('Laboratório atualizado com sucesso!'); // <- 2. MUDAR
      } else {
        await api.post('/laboratories', labData);
        toast.success('Laboratório criado com sucesso!'); // <- 2. MUDAR
      }
      setShowLabForm(false);
      setCurrentLaboratory(null);
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      toast.error(`Erro ao salvar laboratório: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao salvar laboratório:', err);
    }
  };

  const handleDeleteLab = async (labId) => {
    if (!window.confirm('Tem certeza que deseja DESATIVAR este laboratório? Isso o tornará indisponível para novos agendamentos.')) {
      return;
    }
    try {
      await api.delete(`/laboratories/${labId}`);
      toast.success('Laboratório desativado com sucesso!'); // <- 2. MUDAR
      refreshDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      toast.error(`Erro ao desativar laboratório: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao desativar laboratório:', err);
    }
  };

  const handleViewPeripherals = async (lab) => {
    setCurrentLaboratory(lab);
    setShowManagePeripherals(true);
    setIsPeripheralsLoading(true); // Ativa o loading
    try {
      const response = await api.get(`/laboratories/${lab.id}/peripherals`);
      setPeripheralsOfCurrentLab(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      toast.error(`Erro ao carregar periféricos: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao carregar periféricos:', err);
      setPeripheralsOfCurrentLab([]);
    } finally {
      setIsPeripheralsLoading(false); // Desativa o loading
    }
  };

  const handleCreateOrUpdatePeripheral = async (peripheralData) => {
    if (!currentLaboratory) {
      toast.error('Erro: Nenhum laboratório selecionado.'); // <- 2. MUDAR
      return;
    }
    try {
      if (peripheralData.id) {
        await api.put(`/laboratories/peripherals/${peripheralData.id}`, peripheralData);
        toast.success('Periférico atualizado com sucesso!'); // <- 2. MUDAR
      } else {
        await api.post(`/laboratories/${currentLaboratory.id}/peripherals`, peripheralData);
        toast.success('Periférico adicionado com sucesso!'); // <- 2. MUDAR
      }
      setShowPeripheralForm(false);
      setCurrentPeripheral(null);
      handleViewPeripherals(currentLaboratory); // Recarrega a lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      toast.error(`Erro ao salvar periférico: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao salvar periférico:', err);
    }
  };

  const handleDeletePeripheral = async (peripheralId) => {
    if (!window.confirm('Tem certeza que deseja DESATIVAR este periférico?')) {
      return;
    }
    try {
      await api.delete(`/laboratories/peripherals/${peripheralId}`);
      toast.success('Periférico desativado com sucesso!'); // <- 2. MUDAR
      handleViewPeripherals(currentLaboratory); // Recarrega a lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      toast.error(`Erro ao desativar periférico: ${errorMsg}`); // <- 2. MUDAR
      console.error('Erro ao desativar periférico:', err);
    }
  };

  return {
    showManageLabs, setShowManageLabs,
    showManagePeripherals, setShowManagePeripherals,
    currentLaboratory, setCurrentLaboratory,
    currentPeripheral, setCurrentPeripheral,
    showLabForm, setShowLabForm,
    showPeripheralForm, setShowPeripheralForm,
    peripheralsOfCurrentLab,
    isPeripheralsLoading, // <- 3. RETORNAR NOVO ESTADO
    handleCreateOrUpdateLab,
    handleDeleteLab,
    handleViewPeripherals,
    handleCreateOrUpdatePeripheral,
    handleDeletePeripheral,
  };
};