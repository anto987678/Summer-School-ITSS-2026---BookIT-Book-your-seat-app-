package com.itsmartsystems.bookyourseat.dto;

import com.itsmartsystems.bookyourseat.model.Reservation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationRequest {

    @NotNull(message = "Booking type is required")
    private Reservation.TipRezervare bookingType;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotBlank(message = "Space is required")
    private String spaceId;

    private String seatId;
    private LocalDate dataSfarsitRecurenta;

    public ReservationRequest() {
    }

    public ReservationRequest(Reservation.TipRezervare bookingType, LocalDateTime startTime, LocalDateTime endTime,
            String spaceId, String seatId, LocalDate dataSfarsitRecurenta) {
        this.bookingType = bookingType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.spaceId = spaceId;
        this.seatId = seatId;
        this.dataSfarsitRecurenta = dataSfarsitRecurenta;
    }

    public Reservation.TipRezervare getBookingType() {
        return bookingType;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public String getSeatId() {
        return seatId;
    }

    public LocalDate getDataSfarsitRecurenta() {
        return dataSfarsitRecurenta;
    }
}