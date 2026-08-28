package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_Id(Integer userId);

    List<Notification> findByUser_IdOrderByCreatedAtDesc(Integer userId);

    @Query("""
        select distinct n from Notification n
        left join fetch n.user
        left join fetch n.invitation invitation
        left join fetch invitation.senderId
        left join fetch invitation.receiverId
        left join fetch invitation.seatId seat
        left join fetch seat.room room
        left join fetch room.floor
        left join fetch n.reservation reservation
        left join fetch reservation.user
        left join fetch reservation.seat reservationSeat
        left join fetch reservationSeat.room reservationSeatRoom
        left join fetch reservationSeatRoom.floor
        left join fetch reservation.room reservationRoom
        left join fetch reservationRoom.floor
        where n.user.id = :userId
        order by n.createdAt desc
    """)
    List<Notification> findWithDetailsByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId);

    List<Notification> findByUser_IdAndIsReadFalse(Integer userId);

    @Query("""
        select distinct n from Notification n
        left join fetch n.user
        left join fetch n.invitation invitation
        left join fetch invitation.senderId
        left join fetch invitation.receiverId
        left join fetch invitation.seatId seat
        left join fetch seat.room room
        left join fetch room.floor
        left join fetch n.reservation reservation
        left join fetch reservation.user
        left join fetch reservation.seat reservationSeat
        left join fetch reservationSeat.room reservationSeatRoom
        left join fetch reservationSeatRoom.floor
        left join fetch reservation.room reservationRoom
        left join fetch reservationRoom.floor
        where n.user.id = :userId
        and n.isRead = false
        and (n.type <> 'COLLEAGUES_COMING' or reservation is not null)
        and (
            (invitation is null and reservation is null)
            or (invitation is not null and invitation.startDateTime >= :startOfToday)
            or (reservation is not null and reservation.startDateTime >= :startOfToday)
        )
        order by n.createdAt desc
    """)
    List<Notification> findUnreadWithDetailsByUserId(
            @Param("userId") Integer userId,
            @Param("startOfToday") LocalDateTime startOfToday);

    List<Notification> findByType(String type);

    List<Notification> findByUser_IdAndType(Integer userId, String type);

    @Query("""
        select count(n) from Notification n
        left join n.invitation invitation
        left join n.reservation reservation
        where n.user.id = :userId
        and n.isRead = false
        and (n.type <> 'COLLEAGUES_COMING' or reservation is not null)
        and (
            (invitation is null and reservation is null)
            or (invitation is not null and invitation.startDateTime >= :startOfToday)
            or (reservation is not null and reservation.startDateTime >= :startOfToday)
        )
    """)
    long countVisibleUnreadByUserId(
            @Param("userId") Integer userId,
            @Param("startOfToday") LocalDateTime startOfToday);

    Optional<Notification> findByInvitation_Id(Long invitationId);

    boolean existsByUser_IdAndReservation_Id(Integer userId, Long reservationId);

    @Modifying
    @Query("""
        delete from Notification n
        where n.invitation is not null
        and n.invitation.startDateTime < :now
    """)
    void deletePastInvitationNotifications(@Param("now") LocalDateTime now);

    @Modifying
    @Query(value = "DELETE FROM notification n WHERE (lower(n.message) LIKE '%' || lower(:pattern) || '%' OR lower(n.title) LIKE '%' || lower(:pattern) || '%' OR n.type IN (:types))", nativeQuery = true)
    int deleteMockNotifications(@Param("pattern") String pattern, @Param("types") List<String> types);
}
