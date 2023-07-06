package con.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import con.harvard.crimson.web.rest.TestUtil;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
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
    void notEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setId(1L);
        Meditation meditation2 = new Meditation();
        meditation2.setId(2L);
        assertThat(meditation1).isNotEqualTo(meditation2);
        meditation1.setId(null);
        assertThat(meditation1).isNotEqualTo(meditation2);
    }

    @Test
    void verifyMeditationIdGetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setId(1L);
        assertThat(meditation1.getId()).isEqualTo(1L);
    }

    @Test
    void verifyMeditationNameGetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setName("name");
        assertThat(meditation1.getName()).isEqualTo("name");
    }

    @Test
    void verifyMeditationContentGetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setContent("content");
        assertThat(meditation1.getContent()).isEqualTo("content");
    }

    @Test
    void verifyMeditationVideoGetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        meditation1.setVideoUrl("video.mp4");
        assertThat(meditation1.getVideoUrl()).isEqualTo("video.mp4");
    }

    @Test
    void verifyMeditationEventGetter() throws Exception {
        TestUtil.equalsVerifier(Meditation.class);
        Meditation meditation1 = new Meditation();
        Event event1 = new Event();
        Set<Event> set = Collections.singleton(event1);
        meditation1.setEvents(set);
        assertThat(meditation1.getEvents()).isEqualTo(set);
    }

    @Test
    void verifyMeditationVideoUrlEmpty() throws Exception {
        Meditation meditation1 = new Meditation();
        assertThat(meditation1.getVideoUrl()).isEqualTo(null);
    }
}
