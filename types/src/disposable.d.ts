/** @interface */
export class IDisposable {
    /**
     * Disposes the object along with all its data (cleaning up any sensitive field from memory).
     */
    dispose(): void;
}
