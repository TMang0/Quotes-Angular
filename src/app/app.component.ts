import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import textos from '../resources/quotes.json';
import { FallingLeavesComponent } from './leaf-component/leaf-component.component';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FallingLeavesComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '';
  texto_random: string;
  idioma_actual: 'english' | 'spanish' = 'english';
  bandera: string;
  animationClass = '';
  private audio: HTMLAudioElement;
  audioPlaying: boolean = false; 
  mostrarModal: boolean = false;

  constructor() {
    this.texto_random = this.obtenerTextoAleatorio();
    this.bandera = this.obtenerBandera();
  
    this.audio = new Audio('assets/cancion.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.5;
  
   
    this.audio
      .play()
      .then(() => {
        this.audioPlaying = true;
        console.log('Reproducción automática exitosa');
      })
      .catch((error) => {
        this.audioPlaying = false;
        console.warn(
          'La reproducción automática fue bloqueada por el navegador. Requiere interacción del usuario.',
          error
        );
      });
  }

  handleLeftButtonClick(): void {
    this.mostrarModal = true; 
  }

  cerrarModal(): void {
    this.mostrarModal = false; 
  }

  obtenerTextoAleatorio(): string {
    const textosArray = textos.textos[this.idioma_actual];
    const indiceAleatorio = Math.floor(Math.random() * textosArray.length);
    return textosArray[indiceAleatorio];
  }

  actualizarTexto(): void {
    this.animationClass = 'fade-out';
    setTimeout(() => {
      this.texto_random = this.obtenerTextoAleatorio();
      this.animationClass = 'fade-in';
    }, 500);
  }

  cambiarIdioma(): void {
    this.idioma_actual = this.idioma_actual === 'english' ? 'spanish' : 'english';
    this.bandera = this.obtenerBandera();
    this.actualizarTexto();
  }

  obtenerBandera(): string {
    return this.idioma_actual === 'english' ? 'assets/Uk.png' : 'assets/Es.png';
  }

  
  toggleAudio(): void {
    if (this.audioPlaying) {
      this.audio.pause(); 
    } else {
      this.audio.play().catch(error => {
        console.error("Error al intentar reproducir el audio: ", error);
      });
    }
    this.audioPlaying = !this.audioPlaying; 
  }
}
