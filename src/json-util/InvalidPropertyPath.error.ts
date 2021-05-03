export default class InvalidPropertyPathError extends Error {
    constructor() {
        super('Invalid JSON property reference given!')
    }
}