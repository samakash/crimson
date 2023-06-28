package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Mood;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mood entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {}
