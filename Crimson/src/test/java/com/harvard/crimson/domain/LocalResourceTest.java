package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LocalResourceTest {

//    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LocalResource.class);
        LocalResource localResource1 = new LocalResource();
        localResource1.setId(1L);
        LocalResource localResource2 = new LocalResource();
        localResource2.setId(localResource1.getId());
        assertThat(localResource1).isEqualTo(localResource2);
        localResource2.setId(2L);
        assertThat(localResource1).isNotEqualTo(localResource2);
        localResource1.setId(null);
        assertThat(localResource1).isNotEqualTo(localResource2);
    }
}
