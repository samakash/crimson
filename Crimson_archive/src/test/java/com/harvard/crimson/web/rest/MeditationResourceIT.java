package com.harvard.crimson.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.harvard.crimson.IntegrationTest;
import com.harvard.crimson.domain.Meditation;
import com.harvard.crimson.repository.MeditationRepository;
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
 * Integration tests for the {@link MeditationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MeditationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO_URL = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/meditations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MeditationRepository meditationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMeditationMockMvc;

    private Meditation meditation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meditation createEntity(EntityManager em) {
        Meditation meditation = new Meditation().name(DEFAULT_NAME).content(DEFAULT_CONTENT).videoUrl(DEFAULT_VIDEO_URL);
        return meditation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meditation createUpdatedEntity(EntityManager em) {
        Meditation meditation = new Meditation().name(UPDATED_NAME).content(UPDATED_CONTENT).videoUrl(UPDATED_VIDEO_URL);
        return meditation;
    }

    @BeforeEach
    public void initTest() {
        meditation = createEntity(em);
    }

    @Test
    @Transactional
    void createMeditation() throws Exception {
        int databaseSizeBeforeCreate = meditationRepository.findAll().size();
        // Create the Meditation
        restMeditationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditation)))
            .andExpect(status().isCreated());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeCreate + 1);
        Meditation testMeditation = meditationList.get(meditationList.size() - 1);
        assertThat(testMeditation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMeditation.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testMeditation.getVideoUrl()).isEqualTo(DEFAULT_VIDEO_URL);
    }

    @Test
    @Transactional
    void createMeditationWithExistingId() throws Exception {
        // Create the Meditation with an existing ID
        meditation.setId(1L);

        int databaseSizeBeforeCreate = meditationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeditationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditation)))
            .andExpect(status().isBadRequest());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = meditationRepository.findAll().size();
        // set the field null
        meditation.setName(null);

        // Create the Meditation, which fails.

        restMeditationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditation)))
            .andExpect(status().isBadRequest());

        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVideoUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = meditationRepository.findAll().size();
        // set the field null
        meditation.setVideoUrl(null);

        // Create the Meditation, which fails.

        restMeditationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditation)))
            .andExpect(status().isBadRequest());

        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMeditations() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        // Get all the meditationList
        restMeditationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meditation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].videoUrl").value(hasItem(DEFAULT_VIDEO_URL)));
    }

    @Test
    @Transactional
    void getMeditation() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        // Get the meditation
        restMeditationMockMvc
            .perform(get(ENTITY_API_URL_ID, meditation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(meditation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.videoUrl").value(DEFAULT_VIDEO_URL));
    }

    @Test
    @Transactional
    void getNonExistingMeditation() throws Exception {
        // Get the meditation
        restMeditationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMeditation() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();

        // Update the meditation
        Meditation updatedMeditation = meditationRepository.findById(meditation.getId()).get();
        // Disconnect from session so that the updates on updatedMeditation are not directly saved in db
        em.detach(updatedMeditation);
        updatedMeditation.name(UPDATED_NAME).content(UPDATED_CONTENT).videoUrl(UPDATED_VIDEO_URL);

        restMeditationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMeditation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMeditation))
            )
            .andExpect(status().isOk());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
        Meditation testMeditation = meditationList.get(meditationList.size() - 1);
        assertThat(testMeditation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeditation.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testMeditation.getVideoUrl()).isEqualTo(UPDATED_VIDEO_URL);
    }

    @Test
    @Transactional
    void putNonExistingMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, meditation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meditation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meditation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMeditationWithPatch() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();

        // Update the meditation using partial update
        Meditation partialUpdatedMeditation = new Meditation();
        partialUpdatedMeditation.setId(meditation.getId());

        partialUpdatedMeditation.name(UPDATED_NAME).videoUrl(UPDATED_VIDEO_URL);

        restMeditationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeditation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeditation))
            )
            .andExpect(status().isOk());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
        Meditation testMeditation = meditationList.get(meditationList.size() - 1);
        assertThat(testMeditation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeditation.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testMeditation.getVideoUrl()).isEqualTo(UPDATED_VIDEO_URL);
    }

    @Test
    @Transactional
    void fullUpdateMeditationWithPatch() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();

        // Update the meditation using partial update
        Meditation partialUpdatedMeditation = new Meditation();
        partialUpdatedMeditation.setId(meditation.getId());

        partialUpdatedMeditation.name(UPDATED_NAME).content(UPDATED_CONTENT).videoUrl(UPDATED_VIDEO_URL);

        restMeditationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeditation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeditation))
            )
            .andExpect(status().isOk());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
        Meditation testMeditation = meditationList.get(meditationList.size() - 1);
        assertThat(testMeditation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeditation.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testMeditation.getVideoUrl()).isEqualTo(UPDATED_VIDEO_URL);
    }

    @Test
    @Transactional
    void patchNonExistingMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, meditation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meditation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meditation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeditation() throws Exception {
        int databaseSizeBeforeUpdate = meditationRepository.findAll().size();
        meditation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(meditation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meditation in the database
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeditation() throws Exception {
        // Initialize the database
        meditationRepository.saveAndFlush(meditation);

        int databaseSizeBeforeDelete = meditationRepository.findAll().size();

        // Delete the meditation
        restMeditationMockMvc
            .perform(delete(ENTITY_API_URL_ID, meditation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Meditation> meditationList = meditationRepository.findAll();
        assertThat(meditationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
