package con.harvard.crimson.repository;

import con.harvard.crimson.domain.LocalResource;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LocalResource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LocalResourceRepository extends JpaRepository<LocalResource, Long> {}
