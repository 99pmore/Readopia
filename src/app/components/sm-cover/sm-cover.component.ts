import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookDB } from 'src/app/models/bookDB.interface';

@Component({
  selector: 'app-sm-cover',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sm-cover.component.html',
  styleUrls: ['./sm-cover.component.scss']
})
export class SmCoverComponent implements OnInit {

  @Input() book!: BookDB

  constructor () {}

  ngOnInit(): void {

  }

}
