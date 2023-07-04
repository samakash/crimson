package com.harvard.crimson.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.harvard.crimson.IntegrationTest;
import com.harvard.crimson.domain.LocalResource;
import com.harvard.crimson.repository.LocalResourceRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link LocalResourceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LocalResourceResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/local-resources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LocalResourceRepository localResourceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLocalResourceMockMvc;

    private LocalResource localResource;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LocalResource createEntity(EntityManager em) {
        LocalResource localResource = new LocalResource()
            .title(DEFAULT_TITLE)
            .type(DEFAULT_TYPE)
            .location(DEFAULT_LOCATION)
            .description(DEFAULT_DESCRIPTION)
            .imageURL(DEFAULT_IMAGE_URL);
        return localResource;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LocalResource createUpdatedEntity(EntityManager em) {
        LocalResource localResource = new LocalResource()
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .location(UPDATED_LOCATION)
            .description(UPDATED_DESCRIPTION)
            .imageURL(UPDATED_IMAGE_URL);
        return localResource;
    }

    @BeforeEach
    public void initTest() {
        localResource = createEntity(em);
    }

    @Test
    @Transactional
    void createLocalResource() throws Exception {
        int databaseSizeBeforeCreate = localResourceRepository.findAll().size();
        // Create the LocalResource
        restLocalResourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isCreated());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeCreate + 1);
        LocalResource testLocalResource = localResourceList.get(localResourceList.size() - 1);
        assertThat(testLocalResource.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLocalResource.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testLocalResource.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLocalResource.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLocalResource.getImageURL()).isEqualTo(DEFAULT_IMAGE_URL);
    }

    @Test
    @Transactional
    void createLocalResourceWithExistingId() throws Exception {
        // Create the LocalResource with an existing ID
        localResource.setId(1L);

        int databaseSizeBeforeCreate = localResourceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocalResourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isBadRequest());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = localResourceRepository.findAll().size();
        // set the field null
        localResource.setTitle(null);

        // Create the LocalResource, which fails.

        restLocalResourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isBadRequest());

        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = localResourceRepository.findAll().size();
        // set the field null
        localResource.setType(null);

        // Create the LocalResource, which fails.

        restLocalResourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isBadRequest());

        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = localResourceRepository.findAll().size();
        // set the field null
        localResource.setLocation(null);

        // Create the LocalResource, which fails.

        restLocalResourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isBadRequest());

        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLocalResources() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        // Get all the localResourceList
        restLocalResourceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(localResource.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].imageURL").value(hasItem(DEFAULT_IMAGE_URL)));
    }

    @Test
    @Transactional
    void getLocalResource() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        // Get the localResource
        restLocalResourceMockMvc
            .perform(get(ENTITY_API_URL_ID, localResource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(localResource.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.imageURL").value(DEFAULT_IMAGE_URL));
    }

    @Test
    @Transactional
    void getNonExistingLocalResource() throws Exception {
        // Get the localResource
        restLocalResourceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLocalResource() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();

        // Update the localResource
        LocalResource updatedLocalResource = localResourceRepository.findById(localResource.getId()).get();
        // Disconnect from session so that the updates on updatedLocalResource are not directly saved in db
        em.detach(updatedLocalResource);
        updatedLocalResource
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .location(UPDATED_LOCATION)
            .description(UPDATED_DESCRIPTION)
            .imageURL(UPDATED_IMAGE_URL);

        restLocalResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLocalResource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLocalResource))
            )
            .andExpect(status().isOk());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
        LocalResource testLocalResource = localResourceList.get(localResourceList.size() - 1);
        assertThat(testLocalResource.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLocalResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLocalResource.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLocalResource.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLocalResource.getImageURL()).isEqualTo(UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    void putNonExistingLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, localResource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(localResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(localResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(localResource)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLocalResourceWithPatch() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();

        // Update the localResource using partial update
        LocalResource partialUpdatedLocalResource = new LocalResource();
        partialUpdatedLocalResource.setId(localResource.getId());

        partialUpdatedLocalResource.type(UPDATED_TYPE);

        restLocalResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLocalResource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLocalResource))
            )
            .andExpect(status().isOk());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
        LocalResource testLocalResource = localResourceList.get(localResourceList.size() - 1);
        assertThat(testLocalResource.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLocalResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLocalResource.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLocalResource.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLocalResource.getImageURL()).isEqualTo(DEFAULT_IMAGE_URL);
    }

    @Test
    @Transactional
    void fullUpdateLocalResourceWithPatch() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();

        // Update the localResource using partial update
        LocalResource partialUpdatedLocalResource = new LocalResource();
        partialUpdatedLocalResource.setId(localResource.getId());

        partialUpdatedLocalResource
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .location(UPDATED_LOCATION)
            .description(UPDATED_DESCRIPTION)
            .imageURL(UPDATED_IMAGE_URL);

        restLocalResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLocalResource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLocalResource))
            )
            .andExpect(status().isOk());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
        LocalResource testLocalResource = localResourceList.get(localResourceList.size() - 1);
        assertThat(testLocalResource.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLocalResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLocalResource.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLocalResource.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLocalResource.getImageURL()).isEqualTo(UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    void patchNonExistingLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, localResource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(localResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(localResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLocalResource() throws Exception {
        int databaseSizeBeforeUpdate = localResourceRepository.findAll().size();
        localResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLocalResourceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(localResource))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LocalResource in the database
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLocalResource() throws Exception {
        // Initialize the database
        localResourceRepository.saveAndFlush(localResource);

        int databaseSizeBeforeDelete = localResourceRepository.findAll().size();

        // Delete the localResource
        restLocalResourceMockMvc
            .perform(delete(ENTITY_API_URL_ID, localResource.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LocalResource> localResourceList = localResourceRepository.findAll();
        assertThat(localResourceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
