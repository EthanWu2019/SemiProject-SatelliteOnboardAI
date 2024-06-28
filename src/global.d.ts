declare module 'tiff.js' {
    export class Tiff {
        constructor(params: { buffer: ArrayBuffer });
        toCanvas(): HTMLCanvasElement;
        static initialize(options: { TOTAL_MEMORY: number }): void;
    }
    export default Tiff;
}