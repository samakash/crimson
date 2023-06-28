package com.harvard.crimson.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.harvard.crimson.IntegrationTest;
import com.harvard.crimson.domain.MeditationSession;
import com.harvard.crimson.repository.MeditationSessionRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link MeditationSessionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MeditationSessionResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/meditation-sessions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MeditationSessionRepository meditationSessionRepository;

    @Mock
    private MeditationSessionRepository meditationSessionRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMeditationSessionMockMvc;

    private MeditationSession meditationSession;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MeditationSession createEntity(EntityManager em) {
        MeditationSession meditationSession = new MeditationSession()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE);
        return meditationSession;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MeditationSession createUpdatedEntity(EntityManager em) {
        MeditationSession meditationSession = new MeditationSession()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE);
        return meditationSession;
    }

    @BeforeEach
    public void initTest() {
        meditationSession = createEntity(em);
    }

    @Test
    @Transactional
    void createMeditationSession() throws Exception {
        int databaseSizeBeforeCreate = meditationSessionRepository.findAll().size();
        // Create the MeditationSession
        restMeditationSessionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isCreated());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeCreate + 1);
        MeditationSession testMeditationSession = meditationSessionList.get(meditationSessionList.size() - 1);
        assertThat(testMeditationSession.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMeditationSession.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMeditationSession.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createMeditationSessionWithExistingId() throws Exception {
        // Create the MeditationSession with an existing ID
        meditationSession.setId(1L);

        int databaseSizeBeforeCreate = meditationSessionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeditationSessionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = meditationSessionRepository.findAll().size();
        // set the field null
        meditationSession.setTitle(null);

        // Create the MeditationSession, which fails.

        restMeditationSessionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = meditationSessionRepository.findAll().size();
        // set the field null
        meditationSession.setDate(null);

        // Create the MeditationSession, which fails.

        restMeditationSessionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMeditationSessions() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        // Get all the meditationSessionList
        restMeditationSessionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meditationSession.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMeditationSessionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(meditationSessionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMeditationSessionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(meditationSessionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMeditationSessionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(meditationSessionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMeditationSessionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(meditationSessionRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMeditationSession() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        // Get the meditationSession
        restMeditationSessionMockMvc
            .perform(get(ENTITY_API_URL_ID, meditationSession.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(meditationSession.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMeditationSession() throws Exception {
        // Get the meditationSession
        restMeditationSessionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMeditationSession() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();

        // Update the meditationSession
        MeditationSession updatedMeditationSession = meditationSessionRepository.findById(meditationSession.getId()).get();
        // Disconnect from session so that the updates on updatedMeditationSession are not directly saved in db
        em.detach(updatedMeditationSession);
        updatedMeditationSession.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).date(UPDATED_DATE);

        restMeditationSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMeditationSession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMeditationSession))
            )
            .andExpect(status().isOk());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
        MeditationSession testMeditationSession = meditationSessionList.get(meditationSessionList.size() - 1);
        assertThat(testMeditationSession.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMeditationSession.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeditationSession.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, meditationSession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMeditationSessionWithPatch() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();

        // Update the meditationSession using partial update
        MeditationSession partialUpdatedMeditationSession = new MeditationSession();
        partialUpdatedMeditationSession.setId(meditationSession.getId());

        partialUpdatedMeditationSession.date(UPDATED_DATE);

        restMeditationSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeditationSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeditationSession))
            )
            .andExpect(status().isOk());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
        MeditationSession testMeditationSession = meditationSessionList.get(meditationSessionList.size() - 1);
        assertThat(testMeditationSession.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMeditationSession.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMeditationSession.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateMeditationSessionWithPatch() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();

        // Update the meditationSession using partial update
        MeditationSession partialUpdatedMeditationSession = new MeditationSession();
        partialUpdatedMeditationSession.setId(meditationSession.getId());

        partialUpdatedMeditationSession.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).date(UPDATED_DATE);

        restMeditationSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeditationSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeditationSession))
            )
            .andExpect(status().isOk());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
        MeditationSession testMeditationSession = meditationSessionList.get(meditationSessionList.size() - 1);
        assertThat(testMeditationSession.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMeditationSession.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeditationSession.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, meditationSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeditationSession() throws Exception {
        int databaseSizeBeforeUpdate = meditationSessionRepository.findAll().size();
        meditationSession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeditationSessionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meditationSession))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MeditationSession in the database
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeditationSession() throws Exception {
        // Initialize the database
        meditationSessionRepository.saveAndFlush(meditationSession);

        int databaseSizeBeforeDelete = meditationSessionRepository.findAll().size();

        // Delete the meditationSession
        restMeditationSessionMockMvc
            .perform(delete(ENTITY_API_URL_ID, meditationSession.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MeditationSession> meditationSessionList = meditationSessionRepository.findAll();
        assertThat(meditationSessionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
