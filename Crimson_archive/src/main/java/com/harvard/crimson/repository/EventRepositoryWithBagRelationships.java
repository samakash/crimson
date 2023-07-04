package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Event;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EventRepositoryWithBagRelationships {
    Optional<Event> fetchBagRelationships(Optional<Event> event);

    List<Event> fetchBagRelationships(List<Event> events);

    Page<Event> fetchBagRelationships(Page<Event> events);
}
