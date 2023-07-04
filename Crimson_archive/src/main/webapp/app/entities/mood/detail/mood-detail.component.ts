import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMood } from '../mood.model';

@Component({
  selector: 'jhi-mood-detail',
  templateUrl: './mood-detail.component.html',
})
export class MoodDetailComponent implements OnInit {
  mood: IMood | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mood }) => {
      this.mood = mood;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
