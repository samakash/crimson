package com.harvard.crimson.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.harvard.crimson.IntegrationTest;
import com.harvard.crimson.domain.Mood;
import com.harvard.crimson.repository.MoodRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MoodResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MoodResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/moods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MoodRepository moodRepository;

    @Mock
    private MoodRepository moodRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoodMockMvc;

    private Mood mood;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mood createEntity(EntityManager em) {
        Mood mood = new Mood().name(DEFAULT_NAME);
        return mood;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mood createUpdatedEntity(EntityManager em) {
        Mood mood = new Mood().name(UPDATED_NAME);
        return mood;
    }

    @BeforeEach
    public void initTest() {
        mood = createEntity(em);
    }

    @Test
    @Transactional
    void createMood() throws Exception {
        int databaseSizeBeforeCreate = moodRepository.findAll().size();
        // Create the Mood
        restMoodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isCreated());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeCreate + 1);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createMoodWithExistingId() throws Exception {
        // Create the Mood with an existing ID
        mood.setId(1L);

        int databaseSizeBeforeCreate = moodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = moodRepository.findAll().size();
        // set the field null
        mood.setName(null);

        // Create the Mood, which fails.

        restMoodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isBadRequest());

        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMoods() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        // Get all the moodList
        restMoodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mood.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMoodsWithEagerRelationshipsIsEnabled() throws Exception {
        when(moodRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMoodMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(moodRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMoodsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(moodRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMoodMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(moodRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        // Get the mood
        restMoodMockMvc
            .perform(get(ENTITY_API_URL_ID, mood.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mood.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingMood() throws Exception {
        // Get the mood
        restMoodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        int databaseSizeBeforeUpdate = moodRepository.findAll().size();

        // Update the mood
        Mood updatedMood = moodRepository.findById(mood.getId()).get();
        // Disconnect from session so that the updates on updatedMood are not directly saved in db
        em.detach(updatedMood);
        updatedMood.name(UPDATED_NAME);

        restMoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMood.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMood))
            )
            .andExpect(status().isOk());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mood.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mood))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mood))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMoodWithPatch() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        int databaseSizeBeforeUpdate = moodRepository.findAll().size();

        // Update the mood using partial update
        Mood partialUpdatedMood = new Mood();
        partialUpdatedMood.setId(mood.getId());

        partialUpdatedMood.name(UPDATED_NAME);

        restMoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMood))
            )
            .andExpect(status().isOk());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateMoodWithPatch() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        int databaseSizeBeforeUpdate = moodRepository.findAll().size();

        // Update the mood using partial update
        Mood partialUpdatedMood = new Mood();
        partialUpdatedMood.setId(mood.getId());

        partialUpdatedMood.name(UPDATED_NAME);

        restMoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMood))
            )
            .andExpect(status().isOk());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mood))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mood))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();
        mood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        int databaseSizeBeforeDelete = moodRepository.findAll().size();

        // Delete the mood
        restMoodMockMvc
            .perform(delete(ENTITY_API_URL_ID, mood.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
