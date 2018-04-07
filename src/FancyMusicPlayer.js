import React from "react";
import * as THREE from "three";
import MusicController from "./MusicController";
import "./FancyMusicPlayer.scss"

class FancyMusicPlayer extends React.Component {

    constructor() {
        super();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.analyser = null;
        this.uniforms = null;
    }

    state = {
        musicController: null
    };

    componentDidMount() {
        this.init();
        this.animate();
    }

    componentWillReceiveProps(nextProps) {
        let container = document.getElementById('container');
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    renderController(audioObj, audioLoaderObj) {
        this.setState({musicController: <MusicController audioObj={audioObj} audioLoaderObj={audioLoaderObj}/>});
    }

    render() {
        return (
            <div className="FancyMusicPlayer">
                <div id="container">
                </div>
                {this.state.musicController ? this.state.musicController : null}
            </div>
        );
    }

    init = () => {
        let fftSize = 128;
        let cWidth = '412px';
        let cHeight = '170px';
        let container = document.getElementById('container');
        container.style.width = cWidth;
        container.style.height = cHeight;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(cWidth, cHeight);
        this.renderer.setClearColor(0x202020);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();

        let audioLoader = new THREE.AudioLoader();
        let listener = new THREE.AudioListener();
        let audio = new THREE.Audio(listener);

        this.renderController(audio, audioLoader);
        this.analyser = new THREE.AudioAnalyser(audio, fftSize);
        //
        this.uniforms = {
            tAudioData: {value: new THREE.DataTexture(this.analyser.data, fftSize / 2, 1, THREE.LuminanceFormat)}
        };
        let material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: 'varying vec2 vUv;void main() {vUv = uv;gl_Position = vec4( position, 0.52 );}',
            fragmentShader: 'uniform sampler2D tAudioData;varying vec2 vUv;void main() {vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );vec3 color = vec3( 1.0, 1.0, 0.8 );float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );}'
        });
        let geometry = new THREE.PlaneBufferGeometry(1, 1);
        let mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        window.addEventListener('resize', this.onResize, false);
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    onResize = () => {
        let container = document.getElementById('container');
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    /**
     * 尤其注意此函数只能写成赋值表达式的方式,不然requestAnimationFrame嵌套循环装载函数就会丢失this
     */
    animate = () => {
        this.renderThree();
        requestAnimationFrame(this.animate);
    };
    renderThree = () => {
        this.analyser.getFrequencyData();
        this.uniforms.tAudioData.value.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    };
}

export default FancyMusicPlayer;