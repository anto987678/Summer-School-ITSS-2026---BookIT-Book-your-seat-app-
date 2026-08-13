package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.model.Seat;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.Room;
import com.itsmartsystems.bookyourseat.repository.SeatRepository;
import com.itsmartsystems.bookyourseat.repository.ReservationRepository;
import com.itsmartsystems.bookyourseat.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RezervareService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository locRepository;

    public RezervareService(ReservationRepository reservationRepository, RoomRepository roomRepository,
            SeatRepository locRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.locRepository = locRepository;
    }

    public void creareRezervare(String idUtilizator, String codSala, String idLoc, LocalDateTime oraInceput,
            LocalDateTime oraSfarsit, Reservation.TipRezervare tipRezervare, LocalDate dataSfarsitRecurenta) {

        Optional<Room> room = Optional.ofNullable(roomRepository.findByCod(codSala));
        if (room.isEmpty()) {
            throw new IllegalArgumentException("Room este gresita!");
        }

        Optional<Seat> seat = Optional.ofNullable(locRepository.findByCod(idLoc));
        if (seat.isEmpty()) {
            throw new IllegalArgumentException("Locul selectat este indisponibil!");
        }

        if (!seat.get().getSalaId().equals(room.get().getId())) {
            throw new IllegalArgumentException("Room si locul nu corespund!");
        }

        List<Reservation> rezervariExistente = reservationRepository.findByIdLocAndStare(
                Long.valueOf(seat.get().getId()),
                Reservation.Stare.APROBATA);
        for (Reservation reservation : rezervariExistente) {
            if (oraInceput.isBefore(reservation.getOraSfarsit()) && oraSfarsit.isAfter(reservation.getOraInceput())) {
                throw new IllegalArgumentException("Seat rezervat in acest interval orar!");
            }
        }

        Reservation reservation;
        if (tipRezervare == Reservation.TipRezervare.UNICA) {
            reservation = new Reservation(
                    null,
                    Long.valueOf(idUtilizator),
                    Long.valueOf(room.get().getId()),
                    Long.valueOf(seat.get().getId()),
                    oraInceput,
                    oraSfarsit,
                    Reservation.Stare.IN_ASTEPTARE,
                    LocalDateTime.now(),
                    tipRezervare);
            reservationRepository.save(reservation);
        } else {
            String idSerie = UUID.randomUUID().toString();
            List<Reservation> rezervariRecurente = new ArrayList<>();
            LocalDate ziCurenta = oraInceput.toLocalDate();

            while (ziCurenta.isBefore(dataSfarsitRecurenta) || ziCurenta.isEqual(dataSfarsitRecurenta)) {
                DayOfWeek day = ziCurenta.getDayOfWeek();

                if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                    LocalDateTime inceputZi = ziCurenta.atTime(oraInceput.toLocalTime());
                    LocalDateTime sfarsitZi = ziCurenta.atTime(oraSfarsit.toLocalTime());

                    Reservation rezervareZi = new Reservation(
                            idSerie,
                            Long.valueOf(idUtilizator),
                            Long.valueOf(room.get().getId()),
                            Long.valueOf(seat.get().getId()),
                            inceputZi,
                            sfarsitZi,
                            Reservation.Stare.IN_ASTEPTARE,
                            LocalDateTime.now(),
                            tipRezervare);
                    rezervariRecurente.add(rezervareZi);
                }
                ziCurenta = ziCurenta.plusDays(1);
            }
            reservationRepository.saveAll(rezervariRecurente);
        }
    }

    public void stergereRezervare(String id) {
        Reservation reservation = reservationRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("Reservation invalida!"));
        reservationRepository.delete(reservation);
    }

    public Reservation modificareRezervare(String id, String idUtilizator, String codSala, String idLoc,
            LocalDateTime oraInceput, LocalDateTime oraSfarsit, Reservation.TipRezervare tipRezervare) {

        Optional<Room> room = Optional.ofNullable(roomRepository.findByCod(codSala));
        if (room.isEmpty()) {
            throw new IllegalArgumentException("Room este goala!");
        }

        Optional<Seat> seat = locRepository.findById(idLoc);
        if (seat.isEmpty()) {
            throw new IllegalArgumentException("Locul este indisponibil!");
        }

        if (!seat.get().getSalaId().equals(room.get().getId())) {
            throw new IllegalArgumentException("Salile nu corespund!");
        }

        List<Reservation> rezervariExistente = reservationRepository.findByIdLocAndStare(
                Long.valueOf(seat.get().getId()),
                Reservation.Stare.APROBATA);
        for (Reservation reservation : rezervariExistente) {
            if (reservation.getId().equals(id))
                continue;
            if (oraInceput.isBefore(reservation.getOraSfarsit()) && oraSfarsit.isAfter(reservation.getOraInceput())) {
                throw new IllegalArgumentException("Seat rezervat in acest interval orar!");
            }
        }

        Reservation reservation = reservationRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("Reservation invalida!"));

        reservation.setIdUtilizator(Long.valueOf(idUtilizator));
        reservation.setIdSala(Long.valueOf(room.get().getId()));
        reservation.setIdLoc(Long.valueOf(seat.get().getId()));
        reservation.setOraInceput(oraInceput);
        reservation.setOraSfarsit(oraSfarsit);
        reservation.setTipRezervare(tipRezervare);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> istoricRezervari(String idUtilizator) {
        return reservationRepository.findByIdUtilizator(Long.valueOf(idUtilizator));
    }

    public List<Reservation> rezervariInAsteptare() {
        return reservationRepository.findByStare(Reservation.Stare.IN_ASTEPTARE);
    }

    public List<String> locuriOcupate(String idSala, LocalDateTime oraInceput, LocalDateTime oraSfarsit) {
        List<Reservation> rezervari = reservationRepository.findByIdSalaAndStare(Long.valueOf(idSala),
                Reservation.Stare.APROBATA);
        List<String> locuriOcupate = new ArrayList<>();
        for (Reservation r : rezervari) {
            if (oraInceput.isBefore(r.getOraSfarsit()) && oraSfarsit.isAfter(r.getOraInceput())) {
                locuriOcupate.add(String.valueOf(r.getIdLoc()));
            }
        }
        return locuriOcupate;
    }
}