package com.harvard.crimson.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.harvard.crimson.IntegrationTest;
import com.harvard.crimson.domain.Referal;
import com.harvard.crimson.repository.ReferalRepository;
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
 * Integration tests for the {@link ReferalResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ReferalResourceIT {

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/referals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReferalRepository referalRepository;

    @Mock
    private ReferalRepository referalRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReferalMockMvc;

    private Referal referal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Referal createEntity(EntityManager em) {
        Referal referal = new Referal().email(DEFAULT_EMAIL).message(DEFAULT_MESSAGE);
        return referal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Referal createUpdatedEntity(EntityManager em) {
        Referal referal = new Referal().email(UPDATED_EMAIL).message(UPDATED_MESSAGE);
        return referal;
    }

    @BeforeEach
    public void initTest() {
        referal = createEntity(em);
    }

    @Test
    @Transactional
    void createReferal() throws Exception {
        int databaseSizeBeforeCreate = referalRepository.findAll().size();
        // Create the Referal
        restReferalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(referal)))
            .andExpect(status().isCreated());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeCreate + 1);
        Referal testReferal = referalList.get(referalList.size() - 1);
        assertThat(testReferal.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testReferal.getMessage()).isEqualTo(DEFAULT_MESSAGE);
    }

    @Test
    @Transactional
    void createReferalWithExistingId() throws Exception {
        // Create the Referal with an existing ID
        referal.setId(1L);

        int databaseSizeBeforeCreate = referalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReferalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(referal)))
            .andExpect(status().isBadRequest());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = referalRepository.findAll().size();
        // set the field null
        referal.setEmail(null);

        // Create the Referal, which fails.

        restReferalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(referal)))
            .andExpect(status().isBadRequest());

        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReferals() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        // Get all the referalList
        restReferalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(referal.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReferalsWithEagerRelationshipsIsEnabled() throws Exception {
        when(referalRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReferalMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(referalRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReferalsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(referalRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReferalMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(referalRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getReferal() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        // Get the referal
        restReferalMockMvc
            .perform(get(ENTITY_API_URL_ID, referal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(referal.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingReferal() throws Exception {
        // Get the referal
        restReferalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReferal() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        int databaseSizeBeforeUpdate = referalRepository.findAll().size();

        // Update the referal
        Referal updatedReferal = referalRepository.findById(referal.getId()).get();
        // Disconnect from session so that the updates on updatedReferal are not directly saved in db
        em.detach(updatedReferal);
        updatedReferal.email(UPDATED_EMAIL).message(UPDATED_MESSAGE);

        restReferalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReferal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReferal))
            )
            .andExpect(status().isOk());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
        Referal testReferal = referalList.get(referalList.size() - 1);
        assertThat(testReferal.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testReferal.getMessage()).isEqualTo(UPDATED_MESSAGE);
    }

    @Test
    @Transactional
    void putNonExistingReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, referal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(referal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(referal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(referal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReferalWithPatch() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        int databaseSizeBeforeUpdate = referalRepository.findAll().size();

        // Update the referal using partial update
        Referal partialUpdatedReferal = new Referal();
        partialUpdatedReferal.setId(referal.getId());

        partialUpdatedReferal.message(UPDATED_MESSAGE);

        restReferalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReferal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReferal))
            )
            .andExpect(status().isOk());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
        Referal testReferal = referalList.get(referalList.size() - 1);
        assertThat(testReferal.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testReferal.getMessage()).isEqualTo(UPDATED_MESSAGE);
    }

    @Test
    @Transactional
    void fullUpdateReferalWithPatch() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        int databaseSizeBeforeUpdate = referalRepository.findAll().size();

        // Update the referal using partial update
        Referal partialUpdatedReferal = new Referal();
        partialUpdatedReferal.setId(referal.getId());

        partialUpdatedReferal.email(UPDATED_EMAIL).message(UPDATED_MESSAGE);

        restReferalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReferal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReferal))
            )
            .andExpect(status().isOk());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
        Referal testReferal = referalList.get(referalList.size() - 1);
        assertThat(testReferal.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testReferal.getMessage()).isEqualTo(UPDATED_MESSAGE);
    }

    @Test
    @Transactional
    void patchNonExistingReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, referal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(referal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(referal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReferal() throws Exception {
        int databaseSizeBeforeUpdate = referalRepository.findAll().size();
        referal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReferalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(referal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Referal in the database
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReferal() throws Exception {
        // Initialize the database
        referalRepository.saveAndFlush(referal);

        int databaseSizeBeforeDelete = referalRepository.findAll().size();

        // Delete the referal
        restReferalMockMvc
            .perform(delete(ENTITY_API_URL_ID, referal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Referal> referalList = referalRepository.findAll();
        assertThat(referalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
