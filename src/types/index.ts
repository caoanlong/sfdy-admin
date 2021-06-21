export type Res<T> = {
    code: number,
    message: string,
    data?: T
}

export type User = {
    adminId?: number,
    adminName?: string,
    adminStatus?: number,
    adminAuth?: string,
    adminLoginTime?: number,
    adminLoginIp?: number,
    adminLoginNum?: number,
    adminLastLoginTime?: number,
    adminLastLoginIp?: number
}