export interface GenericResponse<T>{
    Data: T,
    Message: string,
    Status: boolean,
    Code: string
}