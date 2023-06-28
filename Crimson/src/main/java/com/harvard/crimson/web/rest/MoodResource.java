package com.harvard.crimson.web.rest;

import com.harvard.crimson.domain.Mood;
import com.harvard.crimson.repository.MoodRepository;
import com.harvard.crimson.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.harvard.crimson.domain.Mood}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoodResource {

    private final Logger log = LoggerFactory.getLogger(MoodResource.class);

    private static final String ENTITY_NAME = "mood";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoodRepository moodRepository;

    public MoodResource(MoodRepository moodRepository) {
        this.moodRepository = moodRepository;
    }

    /**
     * {@code POST  /moods} : Create a new mood.
     *
     * @param mood the mood to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mood, or with status {@code 400 (Bad Request)} if the mood has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/moods")
    public ResponseEntity<Mood> createMood(@Valid @RequestBody Mood mood) throws URISyntaxException {
        log.debug("REST request to save Mood : {}", mood);
        if (mood.getId() != null) {
            throw new BadRequestAlertException("A new mood cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mood result = moodRepository.save(mood);
        return ResponseEntity
            .created(new URI("/api/moods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /moods/:id} : Updates an existing mood.
     *
     * @param id the id of the mood to save.
     * @param mood the mood to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mood,
     * or with status {@code 400 (Bad Request)} if the mood is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mood couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/moods/{id}")
    public ResponseEntity<Mood> updateMood(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Mood mood)
        throws URISyntaxException {
        log.debug("REST request to update Mood : {}, {}", id, mood);
        if (mood.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mood.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mood result = moodRepository.save(mood);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mood.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /moods/:id} : Partial updates given fields of an existing mood, field will ignore if it is null
     *
     * @param id the id of the mood to save.
     * @param mood the mood to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mood,
     * or with status {@code 400 (Bad Request)} if the mood is not valid,
     * or with status {@code 404 (Not Found)} if the mood is not found,
     * or with status {@code 500 (Internal Server Error)} if the mood couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/moods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mood> partialUpdateMood(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Mood mood
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mood partially : {}, {}", id, mood);
        if (mood.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mood.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mood> result = moodRepository
            .findById(mood.getId())
            .map(existingMood -> {
                if (mood.getName() != null) {
                    existingMood.setName(mood.getName());
                }

                return existingMood;
            })
            .map(moodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mood.getId().toString())
        );
    }

    /**
     * {@code GET  /moods} : get all the moods.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moods in body.
     */
    @GetMapping("/moods")
    public ResponseEntity<List<Mood>> getAllMoods(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Moods");
        Page<Mood> page = moodRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /moods/:id} : get the "id" mood.
     *
     * @param id the id of the mood to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mood, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/moods/{id}")
    public ResponseEntity<Mood> getMood(@PathVariable Long id) {
        log.debug("REST request to get Mood : {}", id);
        Optional<Mood> mood = moodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mood);
    }

    /**
     * {@code DELETE  /moods/:id} : delete the "id" mood.
     *
     * @param id the id of the mood to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/moods/{id}")
    public ResponseEntity<Void> deleteMood(@PathVariable Long id) {
        log.debug("REST request to delete Mood : {}", id);
        moodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
