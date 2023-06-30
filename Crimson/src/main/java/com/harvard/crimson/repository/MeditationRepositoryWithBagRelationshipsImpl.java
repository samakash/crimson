package com.harvard.crimson.repository;

import com.harvard.crimson.domain.Meditation;
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
public class MeditationRepositoryWithBagRelationshipsImpl implements MeditationRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Meditation> fetchBagRelationships(Optional<Meditation> meditation) {
        return meditation.map(this::fetchMoods);
    }

    @Override
    public Page<Meditation> fetchBagRelationships(Page<Meditation> meditations) {
        return new PageImpl<>(fetchBagRelationships(meditations.getContent()), meditations.getPageable(), meditations.getTotalElements());
    }

    @Override
    public List<Meditation> fetchBagRelationships(List<Meditation> meditations) {
        return Optional.of(meditations).map(this::fetchMoods).orElse(Collections.emptyList());
    }

    Meditation fetchMoods(Meditation result) {
        return entityManager
            .createQuery(
                "select meditation from Meditation meditation left join fetch meditation.moods where meditation is :meditation",
                Meditation.class
            )
            .setParameter("meditation", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Meditation> fetchMoods(List<Meditation> meditations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, meditations.size()).forEach(index -> order.put(meditations.get(index).getId(), index));
        List<Meditation> result = entityManager
            .createQuery(
                "select distinct meditation from Meditation meditation left join fetch meditation.moods where meditation in :meditations",
                Meditation.class
            )
            .setParameter("meditations", meditations)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
