package com.harvard.calm.repository;

import com.harvard.calm.domain.Event;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class EventRepositoryWithBagRelationshipsImpl implements EventRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Event> fetchBagRelationships(Optional<Event> event) {
        return event.map(this::fetchUsers);
    }

    @Override
    public Page<Event> fetchBagRelationships(Page<Event> events) {
        return new PageImpl<>(fetchBagRelationships(events.getContent()), events.getPageable(), events.getTotalElements());
    }

    @Override
    public List<Event> fetchBagRelationships(List<Event> events) {
        return Optional.of(events).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    Event fetchUsers(Event result) {
        return entityManager
            .createQuery("select event from Event event left join fetch event.users where event is :event", Event.class)
            .setParameter("event", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Event> fetchUsers(List<Event> events) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, events.size()).forEach(index -> order.put(events.get(index).getId(), index));
        List<Event> result = entityManager
            .createQuery("select distinct event from Event event left join fetch event.users where event in :events", Event.class)
            .setParameter("events", events)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
