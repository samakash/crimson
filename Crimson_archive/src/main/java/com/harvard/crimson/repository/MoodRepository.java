package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Mood;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mood entity.
 */
@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {
    default Optional<Mood> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Mood> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Mood> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct mood from Mood mood left join fetch mood.meditation",
        countQuery = "select count(distinct mood) from Mood mood"
    )
    Page<Mood> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct mood from Mood mood left join fetch mood.meditation")
    List<Mood> findAllWithToOneRelationships();

    @Query("select mood from Mood mood left join fetch mood.meditation where mood.id =:id")
    Optional<Mood> findOneWithToOneRelationships(@Param("id") Long id);
}
