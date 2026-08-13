package com.itsmartsystems.bookyourseat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
public class Reservation {

    public enum TipRezervare {
        UNICA,
        RECURENTA
    }

    public enum Stare {
        IN_ASTEPTARE,
        APROBATA,
        RESPINSA,
        ANULATA,
        FINALIZATA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private PostgresUser user;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @Column(name = "status", nullable = false, length = 100)
    private String status;

    @Column(name = "recurrence", nullable = false)
    private Integer recurrence;

    @Transient
    private String idSerie;

    @Transient
    private Long aprobatDe;

    @Transient
    private LocalDateTime dataAprobarii;

    @Transient
    private String motivRespingere;

    @Transient
    private LocalDateTime dataCrearii;

    @Transient
    private TipRezervare tipRezervare;

    public Reservation() {}

    public Reservation(Long id, PostgresUser user, Seat seat, Room room, LocalDateTime startDateTime, LocalDateTime endDateTime, String status, Integer recurrence) {
        this.id = id;
        this.user = user;
        this.seat = seat;
        this.room = room;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.recurrence = recurrence;
    }

    public Reservation(String idSerie, Long idUtilizator, Long idSala, Long idLoc,
            LocalDateTime oraInceput, LocalDateTime oraSfarsit, Stare stare,
            LocalDateTime dataCrearii, TipRezervare tipRezervare) {
        this.idSerie = idSerie;
        this.startDateTime = oraInceput;
        this.endDateTime = oraSfarsit;
        this.status = stare.name();
        this.recurrence = tipRezervare == TipRezervare.RECURENTA ? 1 : 0;
        this.dataCrearii = dataCrearii;
        this.tipRezervare = tipRezervare;
    }

    public Long getId() { return id; }
    public PostgresUser getUser() { return user; }
    public Seat getSeat() { return seat; }
    public Room getRoom() { return room; }
    public LocalDateTime getStartDateTime() { return startDateTime; }
    public LocalDateTime getEndDateTime() { return endDateTime; }
    public String getStatus() { return status; }
    public Integer getRecurrence() { return recurrence; }

    public void setId(Long id) { this.id = id; }
    public void setUser(PostgresUser user) { this.user = user; }
    public void setSeat(Seat seat) { this.seat = seat; }
    public void setRoom(Room room) { this.room = room; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }
    public void setStatus(String status) { this.status = status; }
    public void setRecurrence(Integer recurrence) { this.recurrence = recurrence; }

    public String getIdSerie() { return idSerie; }
    public void setIdSerie(String idSerie) { this.idSerie = idSerie; }
    public TipRezervare getTipRezervare() { return tipRezervare; }
    public void setTipRezervare(TipRezervare tipRezervare) { this.tipRezervare = tipRezervare; }
    public LocalDateTime getOraInceput() { return startDateTime; }
    public void setOraInceput(LocalDateTime oraInceput) { this.startDateTime = oraInceput; }
    public LocalDateTime getOraSfarsit() { return endDateTime; }
    public void setOraSfarsit(LocalDateTime oraSfarsit) { this.endDateTime = oraSfarsit; }
    public Stare getStare() { return status == null ? null : Stare.valueOf(status); }
    public void setStare(Stare stare) { this.status = stare.name(); }
    public LocalDateTime getDataCrearii() { return dataCrearii; }
    public void setDataCrearii(LocalDateTime dataCrearii) { this.dataCrearii = dataCrearii; }
    public Long getAprobatDe() { return aprobatDe; }
    public void setAprobatDe(Long aprobatDe) { this.aprobatDe = aprobatDe; }
    public LocalDateTime getDataAprobarii() { return dataAprobarii; }
    public void setDataAprobarii(LocalDateTime dataAprobarii) { this.dataAprobarii = dataAprobarii; }
    public String getMotivRespingere() { return motivRespingere; }
    public void setMotivRespingere(String motivRespingere) { this.motivRespingere = motivRespingere; }
    public Long getIdLoc() { return seat == null ? null : seat.getId(); }
    public void setIdLoc(Long idLoc) {}
    public Long getIdSala() { return room == null ? null : room.getId(); }
    public void setIdSala(Long idSala) {}
    public Long getIdUtilizator() { return user == null ? null : user.getId().longValue(); }
    public void setIdUtilizator(Long idUtilizator) {}
}