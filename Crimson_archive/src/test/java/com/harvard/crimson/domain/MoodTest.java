package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MoodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mood.class);
        Mood mood1 = new Mood();
        mood1.setId(1L);
        Mood mood2 = new Mood();
        mood2.setId(mood1.getId());
        assertThat(mood1).isEqualTo(mood2);
        mood2.setId(2L);
        assertThat(mood1).isNotEqualTo(mood2);
        mood1.setId(null);
        assertThat(mood1).isNotEqualTo(mood2);
    }
}
