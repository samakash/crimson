package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Meditation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface MeditationRepositoryWithBagRelationships {
    Optional<Meditation> fetchBagRelationships(Optional<Meditation> meditation);

    List<Meditation> fetchBagRelationships(List<Meditation> meditations);

    Page<Meditation> fetchBagRelationships(Page<Meditation> meditations);
}
