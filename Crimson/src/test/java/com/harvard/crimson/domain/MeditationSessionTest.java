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
    }

    @Test
    void equalsVerifierMediationSessionIdNotZero() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setId(1L);
        MeditationSession meditationSession2 = new MeditationSession();
        meditationSession2.setId(meditationSession1.getId());
        meditationSession2.setId(2L);
        assertThat(meditationSession1.getId()).isNotEqualTo(0);

    }

    @Test
    void equalsVerifierMediationSessionNameSetter() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setTitle("title");
        assertThat(meditationSession1.getTitle()).isEqualTo("title");
    }

    @Test
    void verifyMeditationSessionTitleSetter() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setTitle("title");
        assertThat(meditationSession1.getTitle()).isEqualTo("title");
    }

    @Test
    void verifyMeditationSessionMeditationToMoodSetter() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        Meditation meditation = new Meditation();
        Mood mood = new Mood();
        mood.setMeditation(meditation);
        meditationSession1.setMeditation(mood);
        assertThat(meditationSession1.getMeditation()).isEqualTo(mood);
    }

    @Test
    void verifyMeditationSessionoMoodWithoutMeditationSetter() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        Mood mood = new Mood();
        meditationSession1.setMeditation(mood);
        assertThat(meditationSession1.getMeditation()).isEqualTo(mood);
    }
}
