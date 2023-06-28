package com.harvard.crimson.web.rest;

import com.harvard.crimson.domain.MeditationSession;
import com.harvard.crimson.repository.MeditationSessionRepository;
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
 * REST controller for managing {@link com.harvard.crimson.domain.MeditationSession}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MeditationSessionResource {

    private final Logger log = LoggerFactory.getLogger(MeditationSessionResource.class);

    private static final String ENTITY_NAME = "meditationSession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MeditationSessionRepository meditationSessionRepository;

    public MeditationSessionResource(MeditationSessionRepository meditationSessionRepository) {
        this.meditationSessionRepository = meditationSessionRepository;
    }

    /**
     * {@code POST  /meditation-sessions} : Create a new meditationSession.
     *
     * @param meditationSession the meditationSession to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new meditationSession, or with status {@code 400 (Bad Request)} if the meditationSession has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/meditation-sessions")
    public ResponseEntity<MeditationSession> createMeditationSession(@Valid @RequestBody MeditationSession meditationSession)
        throws URISyntaxException {
        log.debug("REST request to save MeditationSession : {}", meditationSession);
        if (meditationSession.getId() != null) {
            throw new BadRequestAlertException("A new meditationSession cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MeditationSession result = meditationSessionRepository.save(meditationSession);
        return ResponseEntity
            .created(new URI("/api/meditation-sessions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /meditation-sessions/:id} : Updates an existing meditationSession.
     *
     * @param id the id of the meditationSession to save.
     * @param meditationSession the meditationSession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meditationSession,
     * or with status {@code 400 (Bad Request)} if the meditationSession is not valid,
     * or with status {@code 500 (Internal Server Error)} if the meditationSession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/meditation-sessions/{id}")
    public ResponseEntity<MeditationSession> updateMeditationSession(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MeditationSession meditationSession
    ) throws URISyntaxException {
        log.debug("REST request to update MeditationSession : {}, {}", id, meditationSession);
        if (meditationSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meditationSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meditationSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MeditationSession result = meditationSessionRepository.save(meditationSession);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meditationSession.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /meditation-sessions/:id} : Partial updates given fields of an existing meditationSession, field will ignore if it is null
     *
     * @param id the id of the meditationSession to save.
     * @param meditationSession the meditationSession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meditationSession,
     * or with status {@code 400 (Bad Request)} if the meditationSession is not valid,
     * or with status {@code 404 (Not Found)} if the meditationSession is not found,
     * or with status {@code 500 (Internal Server Error)} if the meditationSession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/meditation-sessions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MeditationSession> partialUpdateMeditationSession(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MeditationSession meditationSession
    ) throws URISyntaxException {
        log.debug("REST request to partial update MeditationSession partially : {}, {}", id, meditationSession);
        if (meditationSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meditationSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meditationSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MeditationSession> result = meditationSessionRepository
            .findById(meditationSession.getId())
            .map(existingMeditationSession -> {
                if (meditationSession.getTitle() != null) {
                    existingMeditationSession.setTitle(meditationSession.getTitle());
                }
                if (meditationSession.getDescription() != null) {
                    existingMeditationSession.setDescription(meditationSession.getDescription());
                }
                if (meditationSession.getDate() != null) {
                    existingMeditationSession.setDate(meditationSession.getDate());
                }

                return existingMeditationSession;
            })
            .map(meditationSessionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meditationSession.getId().toString())
        );
    }

    /**
     * {@code GET  /meditation-sessions} : get all the meditationSessions.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of meditationSessions in body.
     */
    @GetMapping("/meditation-sessions")
    public ResponseEntity<List<MeditationSession>> getAllMeditationSessions(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of MeditationSessions");
        Page<MeditationSession> page;
        if (eagerload) {
            page = meditationSessionRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = meditationSessionRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /meditation-sessions/:id} : get the "id" meditationSession.
     *
     * @param id the id of the meditationSession to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the meditationSession, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/meditation-sessions/{id}")
    public ResponseEntity<MeditationSession> getMeditationSession(@PathVariable Long id) {
        log.debug("REST request to get MeditationSession : {}", id);
        Optional<MeditationSession> meditationSession = meditationSessionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(meditationSession);
    }

    /**
     * {@code DELETE  /meditation-sessions/:id} : delete the "id" meditationSession.
     *
     * @param id the id of the meditationSession to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/meditation-sessions/{id}")
    public ResponseEntity<Void> deleteMeditationSession(@PathVariable Long id) {
        log.debug("REST request to delete MeditationSession : {}", id);
        meditationSessionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
