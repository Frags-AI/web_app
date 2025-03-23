export interface CustomError extends Error {
    status?: number
    code?: number
    details?: string
}