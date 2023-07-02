package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
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
    void equalsVerifierWithContactId() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setId(1L);
        Contact contact2 = new Contact();
        contact2.setId(contact1.getId());
        contact2.setId(2L);
        assertThat(contact1).isNotEqualTo(contact2);
    }

    @Test
    void verifyContactDescriptionSetter() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setId(1L);
        contact1.setContent("content");
        assertThat(contact1.getContent()).isEqualTo("content");
    }

    @Test
    void verifyContactInfoSetter() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setInfo("info");
        assertThat(contact1.getInfo()).isEqualTo("info");
    }

    @Test
    void verifyContactContentSetter() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = new Contact();
        contact1.setContent("content");
        assertThat(contact1.getContent()).isEqualTo("content");
    }
}
