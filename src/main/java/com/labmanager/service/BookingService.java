package com.labmanager.service;

import com.labmanager.repository.UserRepository;
import com.labmanager.dto.BookingRequest;
import com.labmanager.dto.BookingStatusUpdateRequest;
import com.labmanager.model.*;
import com.labmanager.repository.BookingPeripheralRepository;
import com.labmanager.repository.BookingRepository;
import com.labmanager.repository.LaboratoryRepository;
import com.labmanager.repository.PeripheralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList; // <-- ADICIONADO
import java.util.List;
import java.util.stream.Collectors;

import com.labmanager.dto.BookingResponseDto; 

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private PeripheralRepository peripheralRepository;

    @Autowired
    private BookingPeripheralRepository bookingPeripheralRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lógica de criação de agendamento ATUALIZADA para lidar com recorrência.
     */
    @Transactional
    public BookingResponseDto createBooking(BookingRequest bookingRequest) {
        User currentUser = authService.getCurrentUser();

        Laboratory laboratory = laboratoryRepository.findById(bookingRequest.getLaboratoryId())
                .orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        if (!laboratory.getActive()) {
            throw new RuntimeException("Laboratório não está disponível para agendamento (inativo).");
        }

        if (bookingRequest.getStartTime().isAfter(bookingRequest.getEndTime())) {
            throw new RuntimeException("Data e hora de início devem ser anteriores à data e hora de fim.");
        }

        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Não é possível agendar para datas/horas passadas.");
        }

        // --- LÓGICA DE RECORRÊNCIA COMEÇA AQUI ---

        // Verifica se é recorrente.
        // O 'Boolean.TRUE.equals' é uma forma segura de checar (evita NullPointerException)
        boolean isRecurring = Boolean.TRUE.equals(bookingRequest.getIsRecurring());
        
        // Define o número de semanas. Se não for recorrente, o loop roda 1 vez.
        int weeksToBook = 1;
        if (isRecurring) {
            // Pega o numWeeks, se for nulo ou <= 0, define 1 (segurança)
            weeksToBook = (bookingRequest.getNumWeeks() != null && bookingRequest.getNumWeeks() > 0) ? bookingRequest.getNumWeeks() : 1;
        }

        Booking firstBooking = null; // Para retornar o primeiro agendamento criado

        // Loop para criar agendamentos (se não for recorrente, roda 1 vez)
        for (int i = 0; i < weeksToBook; i++) {
            // Calcula o start e end para a semana atual
            LocalDateTime currentStartTime = bookingRequest.getStartTime().plusWeeks(i);
            LocalDateTime currentEndTime = bookingRequest.getEndTime().plusWeeks(i);

            // 1. VERIFICAÇÃO DE CONFLITO (PARA CADA SEMANA)
            List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                    laboratory.getId(), currentStartTime, currentEndTime);

            if (!conflictingBookings.isEmpty()) {
                // Se achar conflito (em qualquer semana), a transação inteira falha.
                throw new RuntimeException("Conflito de horário encontrado para a data: " + currentStartTime.toLocalDate());
            }

            // 2. VERIFICAÇÃO DE PERIFÉRICOS (PARA CADA SEMANA)
            // Esta verificação simples assume que a quantidade de periféricos
            // deve estar disponível para todos os agendamentos.
            if (bookingRequest.getPeripherals() != null && !bookingRequest.getPeripherals().isEmpty()) {
                for (BookingRequest.PeripheralRequest peripheralRequest : bookingRequest.getPeripherals()) {
                    Peripheral peripheral = peripheralRepository.findById(peripheralRequest.getPeripheralId())
                            .orElseThrow(() -> new RuntimeException("Periférico com ID " + peripheralRequest.getPeripheralId() + " não encontrado."));

                    if (!peripheral.getLaboratory().getId().equals(laboratory.getId())) {
                        throw new RuntimeException("Periférico '" + peripheral.getName() + "' não pertence ao laboratório selecionado.");
                    }

                    if (peripheral.getQuantity() < peripheralRequest.getQuantity()) {
                        throw new RuntimeException("Quantidade insuficiente do periférico: " + peripheral.getName() + " (para a data " + currentStartTime.toLocalDate() + ")");
                    }
                }
            }

            // 3. CRIA E SALVA O AGENDAMENTO (PARA ESTA SEMANA)
            Booking booking = new Booking(currentUser, laboratory,
                    currentStartTime, currentEndTime,
                    bookingRequest.getPurpose());

            Booking savedBooking = bookingRepository.save(booking);

            // Salva o primeiro agendamento para retornar no final
            if (i == 0) {
                firstBooking = savedBooking;
            }

            // 4. CRIA E SALVA OS PERIFÉRICOS ASSOCIADOS (PARA ESTE AGENDAMENTO)
            if (bookingRequest.getPeripherals() != null && !bookingRequest.getPeripherals().isEmpty()) {
                for (BookingRequest.PeripheralRequest peripheralRequest : bookingRequest.getPeripherals()) {
                    Peripheral peripheral = peripheralRepository.findById(peripheralRequest.getPeripheralId())
                            .orElseThrow(() -> new RuntimeException("Periférico com ID " + peripheralRequest.getPeripheralId() + " não encontrado."));

                    BookingPeripheral bookingPeripheral = new BookingPeripheral(
                            savedBooking, peripheral, peripheralRequest.getQuantity());
                    bookingPeripheralRepository.save(bookingPeripheral);
                }
            }
        } // --- Fim do loop for ---

        // Retorna o DTO do *primeiro* agendamento criado (mesmo se for recorrente)
        // O frontend espera apenas um sucesso, não uma lista.
        return new BookingResponseDto(firstBooking);
    }
    
    // ... (O RESTANTE DOS MÉTODOS 'getMyBookings', 'updateBookingStatus', etc. permanecem INALTERADOS) ...
    public List<BookingResponseDto> getMyBookings() {
        User currentUser = authService.getCurrentUser();
        return bookingRepository.findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> findBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para buscar agendamentos."));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getPendingBookings() {
        return bookingRepository.findByStatusOrderByCreatedAtAsc(BookingStatus.PENDING)
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> findBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto updateBookingStatus(Long bookingId, BookingStatus newStatus, String adminNotes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        BookingStatus oldStatus = booking.getStatus();

        if (newStatus == BookingStatus.APPROVED && oldStatus == BookingStatus.PENDING) {
            updatePeripheralQuantities(booking, -1);
        } else if ((newStatus == BookingStatus.REJECTED || newStatus == BookingStatus.CANCELLED) && oldStatus == BookingStatus.APPROVED) {
            updatePeripheralQuantities(booking, 1);
        }

        if (oldStatus == BookingStatus.PENDING && (newStatus == BookingStatus.APPROVED || newStatus == BookingStatus.REJECTED)) {
            // OK
        } else if (oldStatus != BookingStatus.CANCELLED && oldStatus != BookingStatus.COMPLETED && newStatus == BookingStatus.CANCELLED) {
            // OK
        } else if (oldStatus == BookingStatus.APPROVED && newStatus == BookingStatus.COMPLETED) {
            // OK
        } else {
            throw new RuntimeException("Transição de status inválida de " + oldStatus + " para " + newStatus + ".");
        }

        booking.setStatus(newStatus);
        booking.setAdminNotes(adminNotes);

        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponseDto(updatedBooking);
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId) {
        User currentUser = authService.getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!booking.getUser().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Você não tem permissão para cancelar este agendamento");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED ||
                booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Este agendamento não pode ser cancelado");
        }

        if (booking.getStatus() == BookingStatus.APPROVED) {
            updatePeripheralQuantities(booking, 1);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponseDto(updatedBooking);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        if (booking.getStatus() == BookingStatus.APPROVED) {
            updatePeripheralQuantities(booking, 1);
        }

        bookingRepository.delete(booking);
    }

    private void updatePeripheralQuantities(Booking booking, int multiplier) {
        booking.getBookingPeripherals().forEach(bp -> {
            Peripheral peripheral = bp.getPeripheral();
            int requestedQuantity = bp.getQuantity();

            peripheral.setQuantity(peripheral.getQuantity() + (requestedQuantity * multiplier));
            peripheralRepository.save(peripheral);
        });
    }

    public List<BookingResponseDto> getBookingsInPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findBookingsInPeriod(startDate, endDate)
                .stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }
}