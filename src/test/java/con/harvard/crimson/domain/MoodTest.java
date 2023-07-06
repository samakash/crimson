package con.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import con.harvard.crimson.web.rest.TestUtil;
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

    @Test
    void notEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mood.class);
        Mood mood1 = new Mood();
        mood1.setId(1L);
        Mood mood2 = new Mood();
        mood2.setId(2L);
        assertThat(mood1).isNotEqualTo(mood2);
        mood1.setId(null);
        assertThat(mood1).isNotEqualTo(mood2);
    }

    @Test
    void verifyMoodIdGetter() throws Exception {
        Mood mood1 = new Mood();
        mood1.setId(1L);
        assertThat(mood1.getId()).isEqualTo(1L);
    }

    @Test
    void verifyMoodNameGetter() throws Exception {
        Mood mood1 = new Mood();
        mood1.setName("name");
        assertThat(mood1.getName()).isEqualTo("name");
    }

    @Test
    void verifyMoodMeditationGetter() throws Exception {
        Mood mood1 = new Mood();
        Meditation meditation1 = new Meditation();
        mood1.setMeditation(meditation1);
        assertThat(mood1.getMeditation()).isEqualTo(meditation1);
    }

    @Test
    void verifyMoodMeditationUpdate() throws Exception {
        Mood mood1 = new Mood();
        Meditation meditation1 = new Meditation();
        mood1.setMeditation(meditation1);
        Meditation meditation2 = new Meditation();
        mood1.setMeditation(meditation2);
        assertThat(mood1.getMeditation()).isEqualTo(meditation2);
    }

    @Test
    void verifyMoodMeditationName() throws Exception {
        Mood mood1 = new Mood();
        Meditation meditation1 = new Meditation();
        meditation1.setName("name");
        mood1.setMeditation(meditation1);
        assertThat(mood1.getMeditation().getName()).isEqualTo("name");
    }

    @Test
    void verifyMoodWithoutMeditation() throws Exception {
        Mood mood1 = new Mood();
        mood1.setMeditation(null);
        assertThat(mood1.getMeditation()).isEqualTo(null);
    }
}
