package com.harvard.crimson.repository;

import com.harvard.crimson.domain.MeditationSession;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MeditationSession entity.
 */
@Repository
public interface MeditationSessionRepository extends JpaRepository<MeditationSession, Long> {
    @Query("select meditationSession from MeditationSession meditationSession where meditationSession.user.login = ?#{principal.username}")
    List<MeditationSession> findByUserIsCurrentUser();

    default Optional<MeditationSession> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<MeditationSession> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<MeditationSession> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct meditationSession from MeditationSession meditationSession left join fetch meditationSession.user left join fetch meditationSession.meditation",
        countQuery = "select count(distinct meditationSession) from MeditationSession meditationSession"
    )
    Page<MeditationSession> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct meditationSession from MeditationSession meditationSession left join fetch meditationSession.user left join fetch meditationSession.meditation"
    )
    List<MeditationSession> findAllWithToOneRelationships();

    @Query(
        "select meditationSession from MeditationSession meditationSession left join fetch meditationSession.user left join fetch meditationSession.meditation where meditationSession.id =:id"
    )
    Optional<MeditationSession> findOneWithToOneRelationships(@Param("id") Long id);
}
