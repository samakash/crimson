package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MeditationSessionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setId(1L);
        MeditationSession meditationSession2 = new MeditationSession();
        meditationSession2.setId(meditationSession1.getId());
        assertThat(meditationSession1).isEqualTo(meditationSession2);
        meditationSession2.setId(2L);
        assertThat(meditationSession1).isNotEqualTo(meditationSession2);
        meditationSession1.setId(null);
        assertThat(meditationSession1).isNotEqualTo(meditationSession2);
    }
}
