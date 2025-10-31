package com.labmanager.repository;

import com.labmanager.model.Booking;
import com.labmanager.model.BookingPeripheral;
import com.labmanager.model.Peripheral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações de banco de dados relacionadas aos periféricos dos agendamentos
 */
@Repository
public interface BookingPeripheralRepository extends JpaRepository<BookingPeripheral, Long> {
    
    // Busca periféricos de um agendamento específico
    List<BookingPeripheral> findByBooking(Booking booking);
    
    // Busca agendamentos que usam um periférico específico
    List<BookingPeripheral> findByPeripheral(Peripheral peripheral);
    
    // Remove todos os periféricos de um agendamento
    void deleteByBooking(Booking booking);
}
