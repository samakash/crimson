package com.harvard.crimson.web.rest;

import com.harvard.crimson.domain.Meditation;
import com.harvard.crimson.repository.MeditationRepository;
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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.harvard.crimson.domain.Meditation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MeditationResource {

    private final Logger log = LoggerFactory.getLogger(MeditationResource.class);

    private static final String ENTITY_NAME = "meditation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MeditationRepository meditationRepository;

    public MeditationResource(MeditationRepository meditationRepository) {
        this.meditationRepository = meditationRepository;
    }

    /**
     * {@code POST  /meditations} : Create a new meditation.
     *
     * @param meditation the meditation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new meditation, or with status {@code 400 (Bad Request)} if the meditation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/meditations")
    public ResponseEntity<Meditation> createMeditation(@Valid @RequestBody Meditation meditation) throws URISyntaxException {
        log.debug("REST request to save Meditation : {}", meditation);
        if (meditation.getId() != null) {
            throw new BadRequestAlertException("A new meditation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Meditation result = meditationRepository.save(meditation);
        return ResponseEntity
            .created(new URI("/api/meditations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /meditations/:id} : Updates an existing meditation.
     *
     * @param id the id of the meditation to save.
     * @param meditation the meditation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meditation,
     * or with status {@code 400 (Bad Request)} if the meditation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the meditation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/meditations/{id}")
    public ResponseEntity<Meditation> updateMeditation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Meditation meditation
    ) throws URISyntaxException {
        log.debug("REST request to update Meditation : {}, {}", id, meditation);
        if (meditation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meditation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meditationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Meditation result = meditationRepository.save(meditation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meditation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /meditations/:id} : Partial updates given fields of an existing meditation, field will ignore if it is null
     *
     * @param id the id of the meditation to save.
     * @param meditation the meditation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meditation,
     * or with status {@code 400 (Bad Request)} if the meditation is not valid,
     * or with status {@code 404 (Not Found)} if the meditation is not found,
     * or with status {@code 500 (Internal Server Error)} if the meditation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/meditations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Meditation> partialUpdateMeditation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Meditation meditation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Meditation partially : {}, {}", id, meditation);
        if (meditation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meditation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meditationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Meditation> result = meditationRepository
            .findById(meditation.getId())
            .map(existingMeditation -> {
                if (meditation.getName() != null) {
                    existingMeditation.setName(meditation.getName());
                }
                if (meditation.getContent() != null) {
                    existingMeditation.setContent(meditation.getContent());
                }
                if (meditation.getVideoUrl() != null) {
                    existingMeditation.setVideoUrl(meditation.getVideoUrl());
                }

                return existingMeditation;
            })
            .map(meditationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meditation.getId().toString())
        );
    }

    /**
     * {@code GET  /meditations} : get all the meditations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of meditations in body.
     */
    @GetMapping("/meditations")
    public List<Meditation> getAllMeditations() {
        log.debug("REST request to get all Meditations");
        return meditationRepository.findAll();
    }

    /**
     * {@code GET  /meditations/:id} : get the "id" meditation.
     *
     * @param id the id of the meditation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the meditation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/meditations/{id}")
    public ResponseEntity<Meditation> getMeditation(@PathVariable Long id) {
        log.debug("REST request to get Meditation : {}", id);
        Optional<Meditation> meditation = meditationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(meditation);
    }

    /**
     * {@code DELETE  /meditations/:id} : delete the "id" meditation.
     *
     * @param id the id of the meditation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/meditations/{id}")
    public ResponseEntity<Void> deleteMeditation(@PathVariable Long id) {
        log.debug("REST request to delete Meditation : {}", id);
        meditationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
