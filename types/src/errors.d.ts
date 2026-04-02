export class NotImplementedError extends Error {
    /**
     * Create a new not implemented error.
     *
     * @param {string} methodName - The method's name.
     */
    constructor(methodName: string);
}
