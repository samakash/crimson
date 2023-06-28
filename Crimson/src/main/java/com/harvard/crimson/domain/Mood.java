package com.harvard.crimson.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Mood.
 */
@Entity
@Table(name = "mood")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mood implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 2)
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "mood")
    @JsonIgnoreProperties(value = { "mood", "events" }, allowSetters = true)
    private Set<Meditation> meditations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mood id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Mood name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Meditation> getMeditations() {
        return this.meditations;
    }

    public void setMeditations(Set<Meditation> meditations) {
        if (this.meditations != null) {
            this.meditations.forEach(i -> i.setMood(null));
        }
        if (meditations != null) {
            meditations.forEach(i -> i.setMood(this));
        }
        this.meditations = meditations;
    }

    public Mood meditations(Set<Meditation> meditations) {
        this.setMeditations(meditations);
        return this;
    }

    public Mood addMeditation(Meditation meditation) {
        this.meditations.add(meditation);
        meditation.setMood(this);
        return this;
    }

    public Mood removeMeditation(Meditation meditation) {
        this.meditations.remove(meditation);
        meditation.setMood(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mood)) {
            return false;
        }
        return id != null && id.equals(((Mood) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mood{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
