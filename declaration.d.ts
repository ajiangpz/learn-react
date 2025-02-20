declare module 'three/examples/jsm/controls/OrbitControls' {
    export class OrbitControls {
        constructor(object: THREE.Camera, domElement: HTMLElement);
        enableDamping: boolean;
        update(): void;
        dispose(): void;
    }
}


declare module "*.glsl" {
    const value: string;
    export default value
}

declare module 'pliny/*';
declare module 'body-scroll-lock';
declare module 'pliny/newsletter';
declare module 'pliny/utils/formatDate';
declare module 'pliny/ui/NewsletterForm';