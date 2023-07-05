package con.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import con.harvard.crimson.web.rest.TestUtil;
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

    @Test
    void notEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MeditationSession.class);
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setId(1L);
        MeditationSession meditationSession2 = new MeditationSession();
        meditationSession2.setId(2L);
        assertThat(meditationSession1).isNotEqualTo(meditationSession2);
        meditationSession1.setId(null);
        assertThat(meditationSession1).isNotEqualTo(meditationSession2);
    }

    @Test
    void verifySessionIdGetter() throws Exception {
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setId(1L);
        assertThat(meditationSession1.getId()).isEqualTo(1L);
    }

    @Test
    void verifySessionTitleGetter() throws Exception {
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setTitle("title");
        assertThat(meditationSession1.getTitle()).isEqualTo("title");
    }

    @Test
    void verifySessionDescriptionGetter() throws Exception {
        MeditationSession meditationSession1 = new MeditationSession();
        meditationSession1.setDescription("desc");
        assertThat(meditationSession1.getDescription()).isEqualTo("desc");
    }

    @Test
    void verifySessionMeditationGetter() throws Exception {
        MeditationSession meditationSession1 = new MeditationSession();
        Meditation meditation1 = new Meditation();
        Mood mood1 = new Mood();
        mood1.setMeditation(meditation1);
        meditationSession1.setMeditation(mood1);
        assertThat(meditationSession1.getMeditation()).isEqualTo(mood1);
    }
}
