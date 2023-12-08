import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePhotosService } from 'src/app/services/profile-photos.service';

@Component({
  selector: 'app-character-photo-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-photo-selector.component.html',
  styleUrls: ['./character-photo-selector.component.scss']
})
export class CharacterPhotoSelectorComponent implements OnInit {

  @Input() actualPhoto!: string | undefined
  @Output() selectedPhoto = new EventEmitter<string>()

  public profilePhotos!: any[]
  public photoSelectionOpen: boolean = false

  constructor(
    private profilePhotosService: ProfilePhotosService,
  ) {}

  ngOnInit(): void {
    this.getProfilePhotos()
}

  public openPhotoSelection() {
    this.photoSelectionOpen = !this.photoSelectionOpen
  }
  
  public selectProfilePhoto(image: string) {
    this.selectedPhoto.emit(image)
    this.photoSelectionOpen = false
  }

  private getProfilePhotos() {
    this.profilePhotosService.getPhotos().subscribe(images => {
      this.profilePhotos = images
    })
  }
}
