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
    }

    @Test
    void equalsVerifierMeditationIDNotEqual() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setId(1L);
        Meditation meditation2 = new Meditation();
        meditation2.setId(meditation1.getId());
        meditation2.setId(2L);
        assertThat(meditation1).isNotEqualTo(meditation2);
    }

    @Test
    void equalsVerifierMeditationIDNotNull() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setId(1L);
        Meditation meditation2 = new Meditation();
        meditation2.setId(meditation1.getId());
        meditation2.setId(2L);
        meditation1.setId(null);
        assertThat(meditation1).isNotEqualTo(meditation2);
    }

    @Test
    void verifyMeditationVideoSetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setVideoUrl("url");
        assertThat(meditation1.getVideoUrl()).isEqualTo("url");
    }

    @Test
    void verifyMeditationContentSetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setContent("content");
        assertThat(meditation1.getContent()).isEqualTo("content");
    }

    @Test
    void verifyMeditationNameSetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setName("name");
        assertThat(meditation1.getName()).isEqualTo("name");
    }
}
