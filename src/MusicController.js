/**
 * Author: Russell
 * This component is use to control the audio status.
 */
import React from "react";
import "./MusicController.scss"
import {CannoMP3, EndeavorsMP3, MP3358232, PingPongMP3, SkullbeatzMP3} from "./assets";

class MusicController extends React.Component {


    constructor(props) {
        super(props);
        this.audio = null;
        this.audioLoader = null;
        this.currPlayIndex = 0;
        this.playList = [CannoMP3, EndeavorsMP3, SkullbeatzMP3, MP3358232, PingPongMP3];
        this.audio = this.props.audioObj;
        this.audioLoader = this.props.audioLoaderObj;
        this.state = {
            duration: 0,
            playButton: null
        };
    }

    componentDidMount() {
        if (this.audio.isPlaying) {
            this.setStatePlay(true);
        } else {
            this.setStatePlay(false);
        }
    }

    render() {
        return (
            <div className="MusicController">
                <span onClick={this.preMusic}>上一首</span>
                {this.state.playButton}
                <span onClick={this.nextMusic}>下一首</span>
            </div>
        );
    }

    preMusic = () => {
        if (this.audio.buffer) {
            this.audio.stop();
            this.setStatePlay(false);
        }
        if (--this.currPlayIndex >= 0) {
            this.loadPlay();
        } else {
            this.currPlayIndex = 0;
        }
    };

    play = () => {
        // 注意：audioLoader的load方法加载文件的时候是异步的，所以要把时间线上应该在加载之后的事情放在load里面的回掉函数里面
        if (!this.audio.buffer) {
            this.loadPlay();
        } else {
            this.audio.play();
        }
        this.setStatePlay(true);
    };

    pause = () => {
        this.audio.pause();
        this.setStatePlay(false);
    };

    nextMusic = () => {
        if (this.audio.buffer) {
            this.audio.stop();
            this.setStatePlay(false);
        }
        if (++this.currPlayIndex < this.playList.length) {
            this.loadPlay();
        } else {
            this.currPlayIndex = this.playList.length - 1;
        }
    };

    // load audio file to play by and set current audio duration time(in seconds).
    loadPlay() {
        this.audioLoader.load(this.playList[this.currPlayIndex],
            /**
             * @param buffer: AudioBuffer
             */
            (buffer) => {
                this.audio.setBuffer(buffer);
                this.audio.setLoop(true);
                this.audio.play();
                this.setStatePlay(true);
                this.setState({duration: buffer.duration});
                console.log(this.audio.context.getOutputTimestamp());
            }, (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
    }

    /**
     * set the `playButton` behaviors by true or false.
     * @param boolean: true is playing state's behavior and false is pausing state's.
     */
    setStatePlay(boolean) {
        if (boolean) {
            this.setState({
                playButton: (
                    <span onClick={this.pause}>Pause</span>
                )
            });
        } else {
            this.setState({
                playButton: (
                    <span onClick={this.play}>Play</span>
                )
            });
        }
    }
}

export default MusicController;