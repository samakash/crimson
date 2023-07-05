package con.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import con.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setId(1L);
        Contact contact2 = new Contact();
        contact2.setId(contact1.getId());
        assertThat(contact1).isEqualTo(contact2);
    }

    @Test
    void notEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setId(1L);
        Contact contact2 = new Contact();
        contact2.setId(2L);
        assertThat(contact1).isNotEqualTo(contact2);
        contact1.setId(null);
        assertThat(contact1).isNotEqualTo(contact2);
    }

    @Test
    void verifyContactIdGetter() throws Exception {
        Contact contact1 = new Contact();
        contact1.setId(1L);
        assertThat(contact1.getId()).isEqualTo(1l);
    }

    @Test
    void verifyContactInfoGetter() throws Exception {
        Contact contact1 = new Contact();
        contact1.setInfo("info");
        assertThat(contact1.getInfo()).isEqualTo("info");
    }

    @Test
    void verifyContactContentGetter() throws Exception {
        Contact contact1 = new Contact();
        contact1.setContent("content");
        assertThat(contact1.getContent()).isEqualTo("content");
    }

    @Test
    void verifyContactInfoEmpty() throws Exception {
        Contact contact1 = new Contact();
        contact1.setInfo("");
        assertThat(contact1.getInfo()).isEqualTo("");
    }

    @Test
    void verifyContactContentEmpty() throws Exception {
        Contact contact1 = new Contact();
        contact1.setContent("");
        assertThat(contact1.getContent()).isEqualTo("");
    }
}
