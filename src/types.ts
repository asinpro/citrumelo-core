import { GameObject } from './GameObject'
import { IScene } from './SceneManager'

export interface Class<T> {
    new (...args: any[]): T
}

export enum SceneTransition {
    TRANSITION_FADEIN = 'transition_fadein',
    TRANSITION_FADEOUT = 'transition_fadeout',
    TRANSITION_MOVEINLEFT = 'transition_moveinleft',
    TRANSITION_MOVEINRIGHT = 'transition_moveinright',
    TRANSITION_MOVEINDOWN = 'transition_moveindown',
    TRANSITION_MOVEINUP = 'transition_moveinup',
}

export enum SceneManagerMode {
    /**
     * In this mode, the StateManager will, at maximum, have 3 states running at the same time.
     * One main state, One state to transition to, and a possible Pause state that will be on top.
     */
    SINGLE_MODE = 'singleMode',
    /**
     * In this mode, the StateManager will allow you to define what happens with running states.
     * You ask it to create states and it will run them.
     */
    USER_MODE = 'userMode',
}

export class SceneManagerSceneData {
    public preloading = false
    // public transitionTween: EazeTween;
    public onTransitionComplete!: Function
    public scene!: IScene

    constructor(
        public name: string,
        public type: Class<IScene>,
        public args?: any[],
        public transition?: string,
        public transitionTime?: number
    ) {}

    public destroy() {
        // this.transitionTween?.kill();
        // this.transitionTween = null;
        this.scene.destroy()
    }

    public clone() {
        return new SceneManagerSceneData(
            this.name,
            this.type,
            this.args,
            this.transition,
            this.transitionTime
        )
    }
}
