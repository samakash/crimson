package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Referal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Referal entity.
 */
@Repository
public interface ReferalRepository extends JpaRepository<Referal, Long> {
    @Query("select referal from Referal referal where referal.user.login = ?#{principal.username}")
    List<Referal> findByUserIsCurrentUser();

    default Optional<Referal> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Referal> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Referal> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct referal from Referal referal left join fetch referal.user",
        countQuery = "select count(distinct referal) from Referal referal"
    )
    Page<Referal> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct referal from Referal referal left join fetch referal.user")
    List<Referal> findAllWithToOneRelationships();

    @Query("select referal from Referal referal left join fetch referal.user where referal.id =:id")
    Optional<Referal> findOneWithToOneRelationships(@Param("id") Long id);
}
