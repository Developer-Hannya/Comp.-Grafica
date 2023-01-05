import * as THREE from  'three';
import { camera } from './camera.js';

// Create a listener and add it to que camera
var firstPlay = true;
var listener = new THREE.AudioListener();
  camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );  

// Música
var audioLoader = new THREE.AudioLoader();
<<<<<<< HEAD
audioLoader.load( 'assets/sounds/soundtrack.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.01 );
	sound.play(); // Will play when start button is pressed
=======
export const soundtrack = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/soundtrack.mp3', function( buffer ) {
	soundtrack.setBuffer( buffer );
	soundtrack.setLoop( true );
	sound.setVolume( 0.01 );
>>>>>>> juliana
});

// Som da porta    
export const doorSoundEffect = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/door.mp3', function ( buffer ) {
  doorSoundEffect.setBuffer( buffer );
  doorSoundEffect.setLoop( false );
  sound.setVolume( 2 );
} );

// Som da ponte
export const bridgeSoundEffect = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/bridge.mp3', function ( buffer ) {
  bridgeSoundEffect.setBuffer( buffer );
  bridgeSoundEffect.setLoop( false );
  sound.setVolume( 2 );
} );

// Som da chave
export const keySoundEffect = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/key.mp3', function ( buffer ) {
  keySoundEffect.setBuffer( buffer );
  keySoundEffect.setLoop( false );
  sound.setVolume( 2 );
} );

// Som da plataforma
export const platformSoundEffect = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/platform.mp3', function ( buffer ) {
  platformSoundEffect.setBuffer( buffer );
  platformSoundEffect.setLoop( false );
  sound.setVolume( 2 );
} );

// Som final
export const finalSoundEffect = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/final.mp3', function ( buffer ) {
  finalSoundEffect.setBuffer( buffer );
  finalSoundEffect.setLoop( false );
  sound.setVolume( 2 );
} );