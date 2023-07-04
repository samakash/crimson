package com.harvard.crimson.web.rest;

import com.harvard.crimson.domain.LocalResource;
import com.harvard.crimson.repository.LocalResourceRepository;
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
 * REST controller for managing {@link com.harvard.crimson.domain.LocalResource}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LocalResourceResource {

    private final Logger log = LoggerFactory.getLogger(LocalResourceResource.class);

    private static final String ENTITY_NAME = "localResource";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocalResourceRepository localResourceRepository;

    public LocalResourceResource(LocalResourceRepository localResourceRepository) {
        this.localResourceRepository = localResourceRepository;
    }

    /**
     * {@code POST  /local-resources} : Create a new localResource.
     *
     * @param localResource the localResource to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new localResource, or with status {@code 400 (Bad Request)} if the localResource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/local-resources")
    public ResponseEntity<LocalResource> createLocalResource(@Valid @RequestBody LocalResource localResource) throws URISyntaxException {
        log.debug("REST request to save LocalResource : {}", localResource);
        if (localResource.getId() != null) {
            throw new BadRequestAlertException("A new localResource cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LocalResource result = localResourceRepository.save(localResource);
        return ResponseEntity
            .created(new URI("/api/local-resources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /local-resources/:id} : Updates an existing localResource.
     *
     * @param id the id of the localResource to save.
     * @param localResource the localResource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated localResource,
     * or with status {@code 400 (Bad Request)} if the localResource is not valid,
     * or with status {@code 500 (Internal Server Error)} if the localResource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/local-resources/{id}")
    public ResponseEntity<LocalResource> updateLocalResource(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LocalResource localResource
    ) throws URISyntaxException {
        log.debug("REST request to update LocalResource : {}, {}", id, localResource);
        if (localResource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, localResource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!localResourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LocalResource result = localResourceRepository.save(localResource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, localResource.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /local-resources/:id} : Partial updates given fields of an existing localResource, field will ignore if it is null
     *
     * @param id the id of the localResource to save.
     * @param localResource the localResource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated localResource,
     * or with status {@code 400 (Bad Request)} if the localResource is not valid,
     * or with status {@code 404 (Not Found)} if the localResource is not found,
     * or with status {@code 500 (Internal Server Error)} if the localResource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/local-resources/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LocalResource> partialUpdateLocalResource(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LocalResource localResource
    ) throws URISyntaxException {
        log.debug("REST request to partial update LocalResource partially : {}, {}", id, localResource);
        if (localResource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, localResource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!localResourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LocalResource> result = localResourceRepository
            .findById(localResource.getId())
            .map(existingLocalResource -> {
                if (localResource.getTitle() != null) {
                    existingLocalResource.setTitle(localResource.getTitle());
                }
                if (localResource.getType() != null) {
                    existingLocalResource.setType(localResource.getType());
                }
                if (localResource.getLocation() != null) {
                    existingLocalResource.setLocation(localResource.getLocation());
                }
                if (localResource.getDescription() != null) {
                    existingLocalResource.setDescription(localResource.getDescription());
                }
                if (localResource.getImageURL() != null) {
                    existingLocalResource.setImageURL(localResource.getImageURL());
                }

                return existingLocalResource;
            })
            .map(localResourceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, localResource.getId().toString())
        );
    }

    /**
     * {@code GET  /local-resources} : get all the localResources.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of localResources in body.
     */
    @GetMapping("/local-resources")
    public List<LocalResource> getAllLocalResources() {
        log.debug("REST request to get all LocalResources");
        return localResourceRepository.findAll();
    }

    /**
     * {@code GET  /local-resources/:id} : get the "id" localResource.
     *
     * @param id the id of the localResource to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the localResource, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/local-resources/{id}")
    public ResponseEntity<LocalResource> getLocalResource(@PathVariable Long id) {
        log.debug("REST request to get LocalResource : {}", id);
        Optional<LocalResource> localResource = localResourceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(localResource);
    }

    /**
     * {@code DELETE  /local-resources/:id} : delete the "id" localResource.
     *
     * @param id the id of the localResource to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/local-resources/{id}")
    public ResponseEntity<Void> deleteLocalResource(@PathVariable Long id) {
        log.debug("REST request to delete LocalResource : {}", id);
        localResourceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
