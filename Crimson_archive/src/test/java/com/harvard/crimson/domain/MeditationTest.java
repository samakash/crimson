package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MeditationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setId(1L);
        Meditation meditation2 = new Meditation();
        meditation2.setId(meditation1.getId());
        assertThat(meditation1).isEqualTo(meditation2);
        meditation2.setId(2L);
        assertThat(meditation1).isNotEqualTo(meditation2);
        meditation1.setId(null);
        assertThat(meditation1).isNotEqualTo(meditation2);
    }
}
