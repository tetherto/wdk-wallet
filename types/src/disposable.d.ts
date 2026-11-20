/** @interface */
export class IDisposable {
    /**
     * True if the object has been disposed.
     *
     * @type {boolean}
     */
    get disposed(): boolean;
    /**
     * Disposes the object. Each implementation documents which secret material it clears from memory.
     */
    dispose(): void;
}
