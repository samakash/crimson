package com.harvard.crimson.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.harvard.crimson.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReferalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Referal.class);
        Referal referal1 = new Referal();
        referal1.setId(1L);
        Referal referal2 = new Referal();
        referal2.setId(referal1.getId());
        assertThat(referal1).isEqualTo(referal2);
        referal2.setId(2L);
        assertThat(referal1).isNotEqualTo(referal2);
        referal1.setId(null);
        assertThat(referal1).isNotEqualTo(referal2);
    }
}
