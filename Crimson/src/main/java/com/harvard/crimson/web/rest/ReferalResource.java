package com.harvard.crimson.web.rest;

import com.harvard.crimson.domain.Referal;
import com.harvard.crimson.repository.ReferalRepository;
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
 * REST controller for managing {@link com.harvard.crimson.domain.Referal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReferalResource {

    private final Logger log = LoggerFactory.getLogger(ReferalResource.class);

    private static final String ENTITY_NAME = "referal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReferalRepository referalRepository;

    public ReferalResource(ReferalRepository referalRepository) {
        this.referalRepository = referalRepository;
    }

    /**
     * {@code POST  /referals} : Create a new referal.
     *
     * @param referal the referal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new referal, or with status {@code 400 (Bad Request)} if the referal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/referals")
    public ResponseEntity<Referal> createReferal(@Valid @RequestBody Referal referal) throws URISyntaxException {
        log.debug("REST request to save Referal : {}", referal);
        if (referal.getId() != null) {
            throw new BadRequestAlertException("A new referal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Referal result = referalRepository.save(referal);
        return ResponseEntity
            .created(new URI("/api/referals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /referals/:id} : Updates an existing referal.
     *
     * @param id the id of the referal to save.
     * @param referal the referal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated referal,
     * or with status {@code 400 (Bad Request)} if the referal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the referal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/referals/{id}")
    public ResponseEntity<Referal> updateReferal(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Referal referal
    ) throws URISyntaxException {
        log.debug("REST request to update Referal : {}, {}", id, referal);
        if (referal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, referal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!referalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Referal result = referalRepository.save(referal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, referal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /referals/:id} : Partial updates given fields of an existing referal, field will ignore if it is null
     *
     * @param id the id of the referal to save.
     * @param referal the referal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated referal,
     * or with status {@code 400 (Bad Request)} if the referal is not valid,
     * or with status {@code 404 (Not Found)} if the referal is not found,
     * or with status {@code 500 (Internal Server Error)} if the referal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/referals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Referal> partialUpdateReferal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Referal referal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Referal partially : {}, {}", id, referal);
        if (referal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, referal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!referalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Referal> result = referalRepository
            .findById(referal.getId())
            .map(existingReferal -> {
                if (referal.getEmail() != null) {
                    existingReferal.setEmail(referal.getEmail());
                }
                if (referal.getMessage() != null) {
                    existingReferal.setMessage(referal.getMessage());
                }

                return existingReferal;
            })
            .map(referalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, referal.getId().toString())
        );
    }

    /**
     * {@code GET  /referals} : get all the referals.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of referals in body.
     */
    @GetMapping("/referals")
    public List<Referal> getAllReferals(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Referals");
        if (eagerload) {
            return referalRepository.findAllWithEagerRelationships();
        } else {
            return referalRepository.findAll();
        }
    }

    /**
     * {@code GET  /referals/:id} : get the "id" referal.
     *
     * @param id the id of the referal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the referal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/referals/{id}")
    public ResponseEntity<Referal> getReferal(@PathVariable Long id) {
        log.debug("REST request to get Referal : {}", id);
        Optional<Referal> referal = referalRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(referal);
    }

    /**
     * {@code DELETE  /referals/:id} : delete the "id" referal.
     *
     * @param id the id of the referal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/referals/{id}")
    public ResponseEntity<Void> deleteReferal(@PathVariable Long id) {
        log.debug("REST request to delete Referal : {}", id);
        referalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
