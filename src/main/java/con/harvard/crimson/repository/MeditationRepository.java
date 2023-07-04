package con.harvard.crimson.repository;

import con.harvard.crimson.domain.Meditation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Meditation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MeditationRepository extends JpaRepository<Meditation, Long> {}
